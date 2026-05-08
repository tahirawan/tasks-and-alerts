import { type Entry, type ReminderRule, ReminderMode } from '@tasks-and-alerts/shared-types';
import { subtractOffset } from '@tasks-and-alerts/shared-utils';

/**
 * Computes the concrete reminder datetime from a scheduled entry.
 * Returns null when mode is None or no offset is defined.
 */
export function computeReminderDateTime(
  scheduledDateTime: string,
  reminder: ReminderRule,
): string | null {
  if (reminder.mode === ReminderMode.None) return null;

  if (reminder.mode === ReminderMode.AtTime) {
    return scheduledDateTime;
  }

  if (
    reminder.mode === ReminderMode.BeforeTime &&
    reminder.offsetValue !== undefined &&
    reminder.offsetUnit !== undefined
  ) {
    return subtractOffset(scheduledDateTime, reminder.offsetValue, reminder.offsetUnit);
  }

  return null;
}

/**
 * Enriches an Entry's reminder with its computed datetime. Pure function — returns new object.
 */
export function withComputedReminder(entry: Entry): Entry {
  const computed = computeReminderDateTime(entry.scheduledDateTime, entry.reminder);
  // Destructure out any previous computedReminderDateTime so we don't carry stale values
  const { computedReminderDateTime: _prev, ...baseReminder } = entry.reminder;
  const reminder: ReminderRule =
    computed !== null ? { ...baseReminder, computedReminderDateTime: computed } : baseReminder;
  return { ...entry, reminder };
}
