import {
  type IEntryRepository,
  type INotificationService,
} from '@tasks-and-alerts/shared-types';
import { EntryNotFoundError } from './updateEntry.js';

export async function deleteEntry(
  id: string,
  repository: IEntryRepository,
  notificationService?: INotificationService,
): Promise<void> {
  const existing = await repository.getEntry(id);
  if (!existing) throw new EntryNotFoundError(id);

  if (notificationService && notificationService.isSupported()) {
    await notificationService.cancelReminder(id);
  }

  await repository.deleteEntry(id);
}
