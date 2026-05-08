import { describe, it, expect } from 'vitest';
import { ReminderOffsetUnit } from '@tasks-and-alerts/shared-types';
import {
  subtractOffset,
  offsetToMilliseconds,
  isValidISO,
  isFuture,
  isPast,
  combineDateAndTime,
} from '../datetime.js';

describe('subtractOffset', () => {
  const base = '2030-06-15T10:00:00.000Z';

  it('subtracts minutes', () => {
    expect(subtractOffset(base, 10, ReminderOffsetUnit.Minutes)).toBe('2030-06-15T09:50:00.000Z');
  });

  it('subtracts hours', () => {
    expect(subtractOffset(base, 2, ReminderOffsetUnit.Hours)).toBe('2030-06-15T08:00:00.000Z');
  });

  it('subtracts days', () => {
    expect(subtractOffset(base, 1, ReminderOffsetUnit.Days)).toBe('2030-06-14T10:00:00.000Z');
  });
});

describe('offsetToMilliseconds', () => {
  it('converts minutes', () => {
    expect(offsetToMilliseconds(1, ReminderOffsetUnit.Minutes)).toBe(60_000);
  });

  it('converts hours', () => {
    expect(offsetToMilliseconds(1, ReminderOffsetUnit.Hours)).toBe(3_600_000);
  });

  it('converts days', () => {
    expect(offsetToMilliseconds(1, ReminderOffsetUnit.Days)).toBe(86_400_000);
  });
});

describe('isValidISO', () => {
  it('returns true for valid ISO string', () => {
    expect(isValidISO('2030-06-15T10:00:00.000Z')).toBe(true);
  });

  it('returns false for garbage string', () => {
    expect(isValidISO('not-a-date')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidISO('')).toBe(false);
  });
});

describe('isFuture / isPast', () => {
  it('far future is future', () => {
    expect(isFuture('2099-01-01T00:00:00.000Z')).toBe(true);
  });

  it('far past is past', () => {
    expect(isPast('2000-01-01T00:00:00.000Z')).toBe(true);
  });
});

describe('combineDateAndTime', () => {
  it('returns a valid ISO string', () => {
    const result = combineDateAndTime('2030-06-15', '10:30');
    expect(isValidISO(result)).toBe(true);
  });

  it('throws on invalid date', () => {
    expect(() => combineDateAndTime('bad-date', '10:30')).toThrow();
  });
});
