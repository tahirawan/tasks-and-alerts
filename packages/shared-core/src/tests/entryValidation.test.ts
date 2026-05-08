import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  EntryType,
  ReminderMode,
  ReminderOffsetUnit,
} from '@tasks-and-alerts/shared-types';
import type { CreateEntryInput } from '@tasks-and-alerts/shared-types';
import { validateCreateEntryInput } from '../domain/entryValidation.js';

const futureDate = '2035-01-01T12:00:00.000Z';

const validInput: CreateEntryInput = {
  type: EntryType.Task,
  title: 'Buy groceries',
  scheduledDateTime: futureDate,
  isTodayOnlyTimeEntry: false,
  reminder: { mode: ReminderMode.None },
};

describe('validateCreateEntryInput', () => {
  it('passes a valid task input', () => {
    const result = validateCreateEntryInput(validInput);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when title is empty', () => {
    const result = validateCreateEntryInput({ ...validInput, title: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'title' }),
    );
  });

  it('fails when title is whitespace only', () => {
    const result = validateCreateEntryInput({ ...validInput, title: '   ' });
    expect(result.valid).toBe(false);
  });

  it('fails when title exceeds 200 characters', () => {
    const result = validateCreateEntryInput({ ...validInput, title: 'x'.repeat(201) });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'title' }),
    );
  });

  it('fails when scheduledDateTime is invalid', () => {
    const result = validateCreateEntryInput({
      ...validInput,
      scheduledDateTime: 'not-a-date',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'scheduledDateTime' }),
    );
  });

  it('passes AtTime reminder with no offset fields', () => {
    const result = validateCreateEntryInput({
      ...validInput,
      reminder: { mode: ReminderMode.AtTime },
    });
    expect(result.valid).toBe(true);
  });

  it('fails BeforeTime reminder with offsetValue = 0', () => {
    const result = validateCreateEntryInput({
      ...validInput,
      reminder: {
        mode: ReminderMode.BeforeTime,
        offsetValue: 0,
        offsetUnit: ReminderOffsetUnit.Minutes,
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'reminder.offsetValue' }),
    );
  });

  it('fails BeforeTime reminder without offsetUnit', () => {
    const result = validateCreateEntryInput({
      ...validInput,
      reminder: {
        mode: ReminderMode.BeforeTime,
        offsetValue: 10,
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'reminder.offsetUnit' }),
    );
  });

  it('passes valid BeforeTime reminder far in the future', () => {
    const result = validateCreateEntryInput({
      ...validInput,
      scheduledDateTime: '2035-12-31T23:00:00.000Z',
      reminder: {
        mode: ReminderMode.BeforeTime,
        offsetValue: 30,
        offsetUnit: ReminderOffsetUnit.Minutes,
      },
    });
    expect(result.valid).toBe(true);
  });

  it('fails when notes exceed 2000 characters', () => {
    const result = validateCreateEntryInput({ ...validInput, notes: 'x'.repeat(2001) });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'notes' }),
    );
  });
});
