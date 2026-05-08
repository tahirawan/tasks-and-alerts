import {
  type CreateEntryInput,
  type ValidationResult,
  ReminderMode,
} from '@tasks-and-alerts/shared-types';
import { isValidISO, isPast, subtractOffset } from '@tasks-and-alerts/shared-utils';

export function validateCreateEntryInput(input: CreateEntryInput): ValidationResult {
  const errors = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required.' });
  }

  if (input.title && input.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Title must be 200 characters or fewer.' });
  }

  if (!isValidISO(input.scheduledDateTime)) {
    errors.push({ field: 'scheduledDateTime', message: 'Scheduled date/time is invalid.' });
  }

  if (input.reminder.mode === ReminderMode.BeforeTime) {
    if (input.reminder.offsetValue === undefined || input.reminder.offsetValue <= 0) {
      errors.push({ field: 'reminder.offsetValue', message: 'Offset must be a positive number.' });
    }

    if (!input.reminder.offsetUnit) {
      errors.push({ field: 'reminder.offsetUnit', message: 'Offset unit is required.' });
    }

    if (
      input.reminder.offsetValue !== undefined &&
      input.reminder.offsetUnit &&
      isValidISO(input.scheduledDateTime)
    ) {
      const reminderAt = subtractOffset(
        input.scheduledDateTime,
        input.reminder.offsetValue,
        input.reminder.offsetUnit,
      );
      if (isPast(reminderAt)) {
        errors.push({
          field: 'reminder',
          message: 'Reminder time would be in the past. Adjust the scheduled time or offset.',
        });
      }
    }
  }

  if (input.notes && input.notes.length > 2000) {
    errors.push({ field: 'notes', message: 'Notes must be 2000 characters or fewer.' });
  }

  return { valid: errors.length === 0, errors };
}
