import {
  type CreateEntryInput,
  type Entry,
  type IEntryRepository,
  type INotificationService,
  DataSource,
  EntryStatus,
  SyncStatus,
} from '@tasks-and-alerts/shared-types';
import { generateId, nowISO } from '@tasks-and-alerts/shared-utils';
import { validateCreateEntryInput } from '../domain/entryValidation.js';
import { withComputedReminder } from '../domain/reminderCalculator.js';

export class CreateEntryError extends Error {
  constructor(public readonly validationErrors: { field: string; message: string }[]) {
    super('Entry validation failed');
    this.name = 'CreateEntryError';
  }
}

export async function createEntry(
  input: CreateEntryInput,
  repository: IEntryRepository,
  notificationService?: INotificationService,
): Promise<Entry> {
  const validation = validateCreateEntryInput(input);
  if (!validation.valid) {
    throw new CreateEntryError(validation.errors);
  }

  const now = nowISO();
  const raw: Entry = {
    ...input,
    id: generateId(),
    status: input.status ?? EntryStatus.Pending,
    createdAt: now,
    updatedAt: now,
    source: DataSource.Local,
    syncStatus: SyncStatus.LocalOnly,
  };

  const entry = withComputedReminder(raw);
  const saved = await repository.createEntry(entry);

  if (notificationService && notificationService.isSupported()) {
    await notificationService.scheduleReminder(saved);
  }

  return saved;
}
