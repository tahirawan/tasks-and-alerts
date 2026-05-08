import type {
  Entry,
  EntryFilter,
  IEntryRepository,
  UpdateEntryInput,
} from '@tasks-and-alerts/shared-types';
import { nowISO } from '@tasks-and-alerts/shared-utils';
import type { AppDatabase } from './AppDatabase.js';

export class LocalEntryRepository implements IEntryRepository {
  constructor(private readonly db: AppDatabase) {}

  async listEntries(filter?: EntryFilter): Promise<Entry[]> {
    let collection = this.db.entries.orderBy('scheduledDateTime');

    const all = await collection.toArray();

    return all.filter((entry) => {
      if (filter?.type && entry.type !== filter.type) return false;
      if (filter?.status && entry.status !== filter.status) return false;
      if (filter?.fromDate && entry.scheduledDateTime < filter.fromDate) return false;
      if (filter?.toDate && entry.scheduledDateTime > filter.toDate) return false;
      return true;
    });
  }

  async getEntry(id: string): Promise<Entry | null> {
    return (await this.db.entries.get(id)) ?? null;
  }

  async createEntry(entry: Entry): Promise<Entry> {
    await this.db.entries.add(entry);
    return entry;
  }

  async updateEntry(id: string, patch: UpdateEntryInput): Promise<Entry> {
    await this.db.entries.update(id, { ...patch, updatedAt: nowISO() });
    const updated = await this.getEntry(id);
    if (!updated) throw new Error(`Entry ${id} not found after update`);
    return updated;
  }

  async deleteEntry(id: string): Promise<void> {
    await this.db.entries.delete(id);
  }

  async exportData(): Promise<Entry[]> {
    return this.db.entries.toArray();
  }

  async importData(entries: Entry[]): Promise<void> {
    await this.db.transaction('rw', this.db.entries, async () => {
      for (const entry of entries) {
        await this.db.entries.put(entry);
      }
    });
  }
}
