import { describe, it, expect, beforeEach } from 'vitest';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { EntryType, ReminderMode, EntryStatus, DataSource, SyncStatus } from '@tasks-and-alerts/shared-types';
import type { Entry } from '@tasks-and-alerts/shared-types';
import { LocalEntryRepository } from '../infrastructure/storage/LocalEntryRepository.js';
import { AppDatabase } from '../infrastructure/storage/AppDatabase.js';

function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: 'entry-1',
    type: EntryType.Task,
    title: 'Test task',
    scheduledDateTime: '2035-01-01T10:00:00.000Z',
    isTodayOnlyTimeEntry: false,
    reminder: { mode: ReminderMode.AtTime },
    status: EntryStatus.Pending,
    createdAt: '2035-01-01T00:00:00.000Z',
    updatedAt: '2035-01-01T00:00:00.000Z',
    source: DataSource.Local,
    syncStatus: SyncStatus.LocalOnly,
    ...overrides,
  };
}

describe('LocalEntryRepository', () => {
  let repo: LocalEntryRepository;

  beforeEach(async () => {
    // Fresh isolated IndexedDB per test — no shared state
    const db = new AppDatabase({ indexedDB: new IDBFactory(), IDBKeyRange });
    await db.open();
    repo = new LocalEntryRepository(db);
  });

  it('creates and retrieves an entry', async () => {
    await repo.createEntry(makeEntry());
    const found = await repo.getEntry('entry-1');
    expect(found).not.toBeNull();
    expect(found?.title).toBe('Test task');
  });

  it('returns null for a missing entry', async () => {
    const found = await repo.getEntry('does-not-exist');
    expect(found).toBeNull();
  });

  it('lists all entries', async () => {
    await repo.createEntry(makeEntry({ id: 'a', scheduledDateTime: '2035-01-02T10:00:00.000Z' }));
    await repo.createEntry(makeEntry({ id: 'b', scheduledDateTime: '2035-01-01T10:00:00.000Z' }));
    const list = await repo.listEntries();
    expect(list).toHaveLength(2);
  });

  it('filters entries by type', async () => {
    await repo.createEntry(makeEntry({ id: 'a', type: EntryType.Task }));
    await repo.createEntry(makeEntry({ id: 'b', type: EntryType.Alert }));
    const tasks = await repo.listEntries({ type: EntryType.Task });
    expect(tasks).toHaveLength(1);
    expect(tasks[0]?.type).toBe(EntryType.Task);
  });

  it('updates an entry', async () => {
    await repo.createEntry(makeEntry());
    const updated = await repo.updateEntry('entry-1', { title: 'Updated title' });
    expect(updated.title).toBe('Updated title');
  });

  it('deletes an entry', async () => {
    await repo.createEntry(makeEntry());
    await repo.deleteEntry('entry-1');
    const found = await repo.getEntry('entry-1');
    expect(found).toBeNull();
  });

  it('exports and imports data', async () => {
    await repo.createEntry(makeEntry({ id: 'x' }));
    const exported = await repo.exportData();
    expect(exported).toHaveLength(1);

    await repo.deleteEntry('x');
    await repo.importData(exported);
    const reimported = await repo.getEntry('x');
    expect(reimported?.id).toBe('x');
  });
});
