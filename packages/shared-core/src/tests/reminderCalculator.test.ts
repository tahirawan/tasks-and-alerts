import { describe, it, expect } from 'vitest';
import {
  EntryType,
  ReminderMode,
  ReminderOffsetUnit,
  EntryStatus,
  DataSource,
  SyncStatus,
} from '@tasks-and-alerts/shared-types';
import type { Entry } from '@tasks-and-alerts/shared-types';
import { computeReminderDateTime, withComputedReminder } from '../domain/reminderCalculator.js';

const baseEntry: Entry = {
  id: 'test-1',
  type: EntryType.Task,
  title: 'Test task',
  scheduledDateTime: '2030-06-15T10:00:00.000Z',
  isTodayOnlyTimeEntry: false,
  reminder: { mode: ReminderMode.None },
  status: EntryStatus.Pending,
  createdAt: '2030-06-01T00:00:00.000Z',
  updatedAt: '2030-06-01T00:00:00.000Z',
  source: DataSource.Local,
  syncStatus: SyncStatus.LocalOnly,
};

describe('computeReminderDateTime', () => {
  it('returns null when mode is None', () => {
    const result = computeReminderDateTime('2030-06-15T10:00:00.000Z', {
      mode: ReminderMode.None,
    });
    expect(result).toBeNull();
  });

  it('returns scheduledDateTime when mode is AtTime', () => {
    const scheduled = '2030-06-15T10:00:00.000Z';
    const result = computeReminderDateTime(scheduled, { mode: ReminderMode.AtTime });
    expect(result).toBe(scheduled);
  });

  it('subtracts 10 minutes when BeforeTime with 10 minutes offset', () => {
    const result = computeReminderDateTime('2030-06-15T10:00:00.000Z', {
      mode: ReminderMode.BeforeTime,
      offsetValue: 10,
      offsetUnit: ReminderOffsetUnit.Minutes,
    });
    expect(result).toBe('2030-06-15T09:50:00.000Z');
  });

  it('subtracts 1 hour when BeforeTime with 1 hour offset', () => {
    const result = computeReminderDateTime('2030-06-15T10:00:00.000Z', {
      mode: ReminderMode.BeforeTime,
      offsetValue: 1,
      offsetUnit: ReminderOffsetUnit.Hours,
    });
    expect(result).toBe('2030-06-15T09:00:00.000Z');
  });

  it('subtracts 1 day when BeforeTime with 1 day offset', () => {
    const result = computeReminderDateTime('2030-06-15T10:00:00.000Z', {
      mode: ReminderMode.BeforeTime,
      offsetValue: 1,
      offsetUnit: ReminderOffsetUnit.Days,
    });
    expect(result).toBe('2030-06-14T10:00:00.000Z');
  });

  it('returns null for BeforeTime without offsetValue', () => {
    const result = computeReminderDateTime('2030-06-15T10:00:00.000Z', {
      mode: ReminderMode.BeforeTime,
      offsetUnit: ReminderOffsetUnit.Minutes,
    });
    expect(result).toBeNull();
  });

  it('returns null for BeforeTime without offsetUnit', () => {
    const result = computeReminderDateTime('2030-06-15T10:00:00.000Z', {
      mode: ReminderMode.BeforeTime,
      offsetValue: 10,
    });
    expect(result).toBeNull();
  });
});

describe('withComputedReminder', () => {
  it('sets computedReminderDateTime on entry', () => {
    const entry: Entry = {
      ...baseEntry,
      reminder: {
        mode: ReminderMode.BeforeTime,
        offsetValue: 30,
        offsetUnit: ReminderOffsetUnit.Minutes,
      },
    };
    const result = withComputedReminder(entry);
    expect(result.reminder.computedReminderDateTime).toBe('2030-06-15T09:30:00.000Z');
  });

  it('does not mutate original entry', () => {
    const entry: Entry = {
      ...baseEntry,
      reminder: { mode: ReminderMode.AtTime },
    };
    withComputedReminder(entry);
    expect(entry.reminder.computedReminderDateTime).toBeUndefined();
  });
});
