import type { Entry } from '@tasks-and-alerts/shared-types';
import { EntryStatus, EntryType, ReminderMode } from '@tasks-and-alerts/shared-types';
import { formatDisplayDateTime } from '@tasks-and-alerts/shared-utils';

interface EntryCardProps {
  entry: Entry;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EntryCard({ entry, onComplete, onDelete }: EntryCardProps) {
  const isDone = entry.status === EntryStatus.Completed;

  return (
    <article className={`entry-card flex gap-3 animate-rise ${isDone ? 'entry-card--done' : ''}`}>
      {/* Completion circle */}
      <div className="flex-shrink-0 pt-0.5">
        <button
          onClick={() => onComplete(entry.id)}
          aria-label={isDone ? 'Mark pending' : 'Mark complete'}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: isDone ? '2px solid var(--accent)' : '2px solid rgba(94,59,148,0.32)',
            background: isDone ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 160ms ease',
            flexShrink: 0,
            boxShadow: isDone ? '0 2px 8px rgba(124,103,255,0.4)' : 'none',
          }}
        >
          {isDone && (
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.97rem',
              color: isDone ? 'var(--muted)' : 'var(--ink)',
              textDecoration: isDone ? 'line-through' : 'none',
              lineHeight: 1.3,
            }}
          >
            {entry.title}
          </span>
          <span className={entry.type === EntryType.Task ? 'badge badge--task' : 'badge badge--alert'}>
            {entry.type}
          </span>
        </div>

        {entry.notes && (
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--muted)',
              lineHeight: 1.45,
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {entry.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1" style={{ marginTop: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>
            {formatDisplayDateTime(entry.scheduledDateTime)}
          </span>
          {entry.reminder.mode !== ReminderMode.None && entry.reminder.computedReminderDateTime && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--accent)',
                background: 'rgba(124,103,255,0.1)',
                border: '1px solid rgba(124,103,255,0.2)',
                borderRadius: '999px',
                padding: '2px 8px',
              }}
            >
              🔔 {formatDisplayDateTime(entry.reminder.computedReminderDateTime)}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(entry.id)}
        aria-label="Delete entry"
        style={{
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '1px solid rgba(192,34,58,0.0)',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(94,59,148,0.3)',
          transition: 'all 160ms ease',
          marginTop: '-2px',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#c0223a';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(192,34,58,0.08)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(192,34,58,0.18)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(94,59,148,0.3)';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(192,34,58,0)';
        }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </article>
  );
}
