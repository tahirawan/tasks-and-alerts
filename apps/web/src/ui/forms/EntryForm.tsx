import React, { useState } from 'react';
import type { CreateEntryInput } from '@tasks-and-alerts/shared-types';
import { EntryType, ReminderMode, ReminderOffsetUnit } from '@tasks-and-alerts/shared-types';
import { combineDateAndTime, todayDateString } from '@tasks-and-alerts/shared-utils';

interface EntryFormProps {
  onSubmit: (input: CreateEntryInput) => void;
  loading: boolean;
  validationErrors: { field: string; message: string }[];
}

export function EntryForm({ onSubmit, loading, validationErrors }: EntryFormProps) {
  const today = todayDateString();

  const [type, setType] = useState<EntryType>(EntryType.Task);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isTodayOnly, setIsTodayOnly] = useState(true);
  const [dateStr, setDateStr] = useState(today);
  const [timeStr, setTimeStr] = useState('09:00');
  const [reminderMode, setReminderMode] = useState<ReminderMode>(ReminderMode.AtTime);
  const [offsetValue, setOffsetValue] = useState(10);
  const [offsetUnit, setOffsetUnit] = useState<ReminderOffsetUnit>(ReminderOffsetUnit.Minutes);

  const fieldError = (field: string) => validationErrors.find((e) => e.field === field)?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledDate = isTodayOnly ? today : dateStr;
    const scheduledDateTime = combineDateAndTime(scheduledDate, timeStr);
    const trimmedNotes = notes.trim();

    const input: CreateEntryInput = {
      type,
      title: title.trim(),
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
      scheduledDateTime,
      isTodayOnlyTimeEntry: isTodayOnly,
      reminder: {
        mode: reminderMode,
        ...(reminderMode === ReminderMode.BeforeTime ? { offsetValue, offsetUnit } : {}),
      },
    };
    onSubmit(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}
    >
      {/* Type selector */}
      <div>
        <label className="field-label">Type</label>
        <div className="pill-group">
          {Object.values(EntryType).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`pill ${type === t ? 'pill--active' : ''}`}
            >
              {t === EntryType.Task ? '✅ Task' : '🔔 Alert'}
            </button>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Title */}
      <div>
        <label htmlFor="title" className="field-label">
          Title <span style={{ color: '#c0223a' }}>*</span>
        </label>
        <input
          id="title"
          type="text"
          className={`field-input ${fieldError('title') ? 'field-input--error' : ''}`}
          placeholder="What needs to happen?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          autoFocus
        />
        {fieldError('title') && <p className="field-error">{fieldError('title')}</p>}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="field-label">
          Notes
        </label>
        <textarea
          id="notes"
          className="field-input"
          rows={3}
          placeholder="Optional notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
        />
      </div>

      <hr className="divider" />

      {/* When */}
      <div>
        <label className="field-label">When</label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '0.75rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--ink)',
          }}
        >
          <input
            type="checkbox"
            checked={isTodayOnly}
            onChange={(e) => setIsTodayOnly(e.target.checked)}
            style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer' }}
          />
          Today only (time-only entry)
        </label>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {!isTodayOnly && (
            <input
              type="date"
              className="field-input"
              style={{ flex: 1 }}
              value={dateStr}
              min={today}
              onChange={(e) => setDateStr(e.target.value)}
            />
          )}
          <input
            type="time"
            className="field-input"
            style={{ flex: isTodayOnly ? 1 : '0 0 130px' }}
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
          />
        </div>

        {fieldError('scheduledDateTime') && (
          <p className="field-error">{fieldError('scheduledDateTime')}</p>
        )}
      </div>

      <hr className="divider" />

      {/* Reminder */}
      <div>
        <label className="field-label">Reminder</label>
        <div className="pill-group">
          <button
            type="button"
            className={`pill ${reminderMode === ReminderMode.None ? 'pill--active' : ''}`}
            onClick={() => setReminderMode(ReminderMode.None)}
          >
            None
          </button>
          <button
            type="button"
            className={`pill ${reminderMode === ReminderMode.AtTime ? 'pill--active' : ''}`}
            onClick={() => setReminderMode(ReminderMode.AtTime)}
          >
            At time
          </button>
          <button
            type="button"
            className={`pill ${reminderMode === ReminderMode.BeforeTime ? 'pill--active' : ''}`}
            onClick={() => setReminderMode(ReminderMode.BeforeTime)}
          >
            Before time
          </button>
        </div>

        {reminderMode === ReminderMode.BeforeTime && (
          <div
            style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.75rem' }}
          >
            <input
              type="number"
              min={1}
              className="field-input"
              style={{ width: 90, flex: 'none' }}
              value={offsetValue}
              onChange={(e) => setOffsetValue(Number(e.target.value))}
            />
            <select
              className="field-input"
              style={{ flex: 1 }}
              value={offsetUnit}
              onChange={(e) => setOffsetUnit(e.target.value as ReminderOffsetUnit)}
            >
              {Object.values(ReminderOffsetUnit).map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <span
              style={{
                fontSize: '0.9rem',
                color: 'var(--muted)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              before
            </span>
          </div>
        )}

        {fieldError('reminder') && <p className="field-error">{fieldError('reminder')}</p>}
        {fieldError('reminder.offsetValue') && (
          <p className="field-error">{fieldError('reminder.offsetValue')}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ width: '100%', marginTop: '0.25rem', minHeight: 52, fontSize: '1rem' }}
      >
        {loading ? 'Saving…' : 'Create entry'}
      </button>
    </form>
  );
}
