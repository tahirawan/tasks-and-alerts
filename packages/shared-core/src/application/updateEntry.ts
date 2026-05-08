import {
  type Entry,
  type IEntryRepository,
  type INotificationService,
  type UpdateEntryInput,
} from '@tasks-and-alerts/shared-types';
import { nowISO } from '@tasks-and-alerts/shared-utils';
import { withComputedReminder } from '../domain/reminderCalculator.js';

export class EntryNotFoundError extends Error {
  constructor(id: string) {
    super(`Entry not found: ${id}`);
    this.name = 'EntryNotFoundError';
  }
}

export async function updateEntry(
  id: string,
  patch: UpdateEntryInput,
  repository: IEntryRepository,
  notificationService?: INotificationService,
): Promise<Entry> {
  const existing = await repository.getEntry(id);
  if (!existing) throw new EntryNotFoundError(id);

  const updated = await repository.updateEntry(id, { ...patch, updatedAt: nowISO() });
  const enriched = withComputedReminder(updated);

  if (notificationService && notificationService.isSupported()) {
    await notificationService.rescheduleReminder(enriched);
  }

  return enriched;
}
