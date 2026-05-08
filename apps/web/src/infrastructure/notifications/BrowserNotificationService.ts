import type { Entry, INotificationService } from '@tasks-and-alerts/shared-types';
import { EntryStatus, ReminderMode } from '@tasks-and-alerts/shared-types';

const MISSED_REMINDER_WINDOW_MS = 2 * 60 * 60 * 1000; // show if missed within 2 hours

export class BrowserNotificationService implements INotificationService {
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  // Tracks IDs fired this session so visibilitychange re-checks don't double-notify.
  private readonly fired = new Set<string>();

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
      this.fired.add(entry.id);
      void this.showNotification(entry);
      this.timers.delete(entry.id);
    }, delay);

    this.timers.set(entry.id, timer);
  }

  // Called on app startup and every time the tab becomes visible.
  // Fires any reminders whose scheduled time passed while the app was closed/backgrounded.
  async checkAndFireDue(entries: Entry[]): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    const now = Date.now();
    const cutoff = now - MISSED_REMINDER_WINDOW_MS;

    for (const entry of entries) {
      if (entry.status === EntryStatus.Completed) continue;
      if (entry.reminder.mode === ReminderMode.None) continue;
      if (this.fired.has(entry.id)) continue;

      const reminderAt = entry.reminder.computedReminderDateTime;
      if (!reminderAt) continue;

      const t = new Date(reminderAt).getTime();
      if (t <= now && t >= cutoff) {
        this.fired.add(entry.id);
        void this.showNotification(entry);
      }
    }
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
    this.fired.delete(entryId);
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
