import type { Entry, INotificationService } from '@tasks-and-alerts/shared-types';
import { ReminderMode } from '@tasks-and-alerts/shared-types';

export class BrowserNotificationService implements INotificationService {
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  isSupported(): boolean {
    return typeof Notification !== 'undefined';
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  async scheduleReminder(entry: Entry): Promise<void> {
    if (!this.isSupported()) return;
    if (entry.reminder.mode === ReminderMode.None) return;

    const reminderAt = entry.reminder.computedReminderDateTime;
    if (!reminderAt) return;

    const delay = new Date(reminderAt).getTime() - Date.now();
    if (delay <= 0) return;

    this.cancelTimer(entry.id);

    const timer = setTimeout(async () => {
      const granted = await this.requestPermission();
      if (!granted) return;
      new Notification(entry.title, {
        body: entry.notes ?? `Reminder for: ${entry.title}`,
        icon: '/pwa-192x192.png',
        tag: entry.id,
      });
      this.timers.delete(entry.id);
    }, delay);

    this.timers.set(entry.id, timer);
  }

  async cancelReminder(entryId: string): Promise<void> {
    this.cancelTimer(entryId);
  }

  async rescheduleReminder(entry: Entry): Promise<void> {
    await this.cancelReminder(entry.id);
    await this.scheduleReminder(entry);
  }

  private cancelTimer(entryId: string): void {
    const existing = this.timers.get(entryId);
    if (existing !== undefined) {
      clearTimeout(existing);
      this.timers.delete(entryId);
    }
  }
}
