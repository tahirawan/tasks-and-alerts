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
    // Only schedule if permission is already granted — requesting here would be
    // outside a user gesture on iOS and the prompt would be silently blocked.
    if (Notification.permission !== 'granted') return;

    const reminderAt = entry.reminder.computedReminderDateTime;
    if (!reminderAt) return;

    const delay = new Date(reminderAt).getTime() - Date.now();
    if (delay <= 0) return;

    this.cancelTimer(entry.id);

    const timer = setTimeout(() => {
      void this.showNotification(entry);
      this.timers.delete(entry.id);
    }, delay);

    this.timers.set(entry.id, timer);
  }

  private async showNotification(entry: Entry): Promise<void> {
    const opts = {
      body: entry.notes ?? `Reminder: ${entry.title}`,
      icon: '/icons/icon.svg',
      tag: entry.id,
    };

    // Service-worker notifications are more reliable on mobile than new Notification()
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(entry.title, opts);
        return;
      } catch (_err) {
        // fall through to basic Notification API
      }
    }

    new Notification(entry.title, opts);
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
