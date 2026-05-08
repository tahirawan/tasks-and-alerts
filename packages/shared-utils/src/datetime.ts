import { ReminderOffsetUnit } from '@tasks-and-alerts/shared-types';

export function nowISO(): string {
  return new Date().toISOString();
}

export function toISO(date: Date): string {
  return date.toISOString();
}

export function fromISO(iso: string): Date {
  return new Date(iso);
}

export function isValidISO(iso: string): boolean {
  const d = new Date(iso);
  return !isNaN(d.getTime());
}

/**
 * Combines a date string (YYYY-MM-DD) and time string (HH:MM) into a local ISO string.
 * Uses the local timezone of the executing environment.
 */
export function combineDateAndTime(dateStr: string, timeStr: string): string {
  const combined = `${dateStr}T${timeStr}:00`;
  const d = new Date(combined);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date/time combination: ${combined}`);
  }
  return d.toISOString();
}

/**
 * Returns today's date as YYYY-MM-DD in local timezone.
 */
export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Subtracts an offset from a scheduled ISO datetime, returning the reminder ISO datetime.
 */
export function subtractOffset(
  scheduledISO: string,
  offsetValue: number,
  offsetUnit: ReminderOffsetUnit,
): string {
  const scheduled = new Date(scheduledISO);
  const ms = offsetToMilliseconds(offsetValue, offsetUnit);
  return new Date(scheduled.getTime() - ms).toISOString();
}

export function offsetToMilliseconds(value: number, unit: ReminderOffsetUnit): number {
  switch (unit) {
    case ReminderOffsetUnit.Minutes:
      return value * 60 * 1000;
    case ReminderOffsetUnit.Hours:
      return value * 60 * 60 * 1000;
    case ReminderOffsetUnit.Days:
      return value * 24 * 60 * 60 * 1000;
  }
}

export function isFuture(iso: string): boolean {
  return new Date(iso).getTime() > Date.now();
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() <= Date.now();
}

export function formatDisplayDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

export function formatDisplayTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { timeStyle: 'short' });
}
