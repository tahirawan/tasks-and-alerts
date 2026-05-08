import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEntryStore } from '../../store/entryStore.js';
import { EntryCard } from '../components/EntryCard.js';
import { EntryStatus } from '@tasks-and-alerts/shared-types';

export function EntryListPage() {
  const { entries, loading, error, loadEntries, editEntry, removeEntry } = useEntryStore();

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const handleComplete = async (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    const nextStatus =
      entry.status === EntryStatus.Completed ? EntryStatus.Pending : EntryStatus.Completed;
    await editEntry(id, { status: nextStatus });
  };

  const pending = entries.filter((e) => e.status === EntryStatus.Pending);
  const done = entries.filter((e) => e.status === EntryStatus.Completed);

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="eyebrow" style={{ color: 'rgba(227,204,255,0.45)' }}>
          Loading…
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-rise">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2
            className="font-display font-black text-white"
            style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)' }}
          >
            My Entries
          </h2>
          {entries.length > 0 && (
            <p className="eyebrow mt-0.5" style={{ color: 'rgba(227,204,255,0.45)' }}>
              {pending.length} pending &middot; {done.length} done
            </p>
          )}
        </div>
        <Link to="/entries/new" className="btn-primary">
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New
        </Link>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(192,34,58,0.1)',
            border: '1px solid rgba(192,34,58,0.22)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.1rem',
            fontSize: '0.88rem',
            color: '#c0223a',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && !loading && (
        <div
          className="glass text-center animate-rise"
          style={{ borderRadius: 'var(--radius-xl)', padding: '3.5rem 2rem' }}
        >
          <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>📋</div>
          <h3
            className="font-display font-black"
            style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '0.4rem' }}
          >
            Nothing here yet
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Create your first task or alert below.
          </p>
          <Link to="/entries/new" className="btn-primary">
            Get started
          </Link>
        </div>
      )}

      {/* Pending entries */}
      {pending.length > 0 && (
        <section className="space-y-3">
          {entries.length > 0 && done.length > 0 && (
            <p
              className="eyebrow"
              style={{ color: 'rgba(227,204,255,0.45)', marginBottom: '0.6rem' }}
            >
              Pending
            </p>
          )}
          {pending.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onComplete={handleComplete}
              onDelete={(id) => void removeEntry(id)}
            />
          ))}
        </section>
      )}

      {/* Completed entries */}
      {done.length > 0 && (
        <section className="space-y-3">
          <p
            className="eyebrow"
            style={{ color: 'rgba(227,204,255,0.35)', marginBottom: '0.6rem' }}
          >
            Completed
          </p>
          {done.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onComplete={handleComplete}
              onDelete={(id) => void removeEntry(id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
