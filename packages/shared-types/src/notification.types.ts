import type { Entry } from './entry.types.js';

export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  scheduledAt: string; // ISO 8601
  entryId: string;
}

export interface INotificationService {
  requestPermission(): Promise<boolean>;
  scheduleReminder(entry: Entry): Promise<void>;
  cancelReminder(entryId: string): Promise<void>;
  rescheduleReminder(entry: Entry): Promise<void>;
  isSupported(): boolean;
}
