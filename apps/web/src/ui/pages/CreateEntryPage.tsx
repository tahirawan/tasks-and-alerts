import { useNavigate } from 'react-router-dom';
import { useEntryStore } from '../../store/entryStore.js';
import { EntryForm } from '../forms/EntryForm.js';
import type { CreateEntryInput } from '@tasks-and-alerts/shared-types';

export function CreateEntryPage() {
  const navigate = useNavigate();
  const { addEntry, loading, validationErrors, clearError } = useEntryStore();

  const handleSubmit = async (input: CreateEntryInput) => {
    clearError();
    // Request permission here, directly inside the user gesture handler.
    // iOS blocks Notification.requestPermission() if called outside a tap/click.
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    const entry = await addEntry(input);
    if (entry) {
      navigate('/entries');
    }
  };

  return (
    <div className="animate-rise" style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Back + heading */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="btn-ghost !min-h-[36px] !w-[36px] !px-0 !rounded-full"
          style={{ color: 'rgba(227,204,255,0.7)' }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2
            className="font-display font-black text-white"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 1.55rem)' }}
          >
            New entry
          </h2>
          <p className="eyebrow" style={{ color: 'rgba(227,204,255,0.45)', marginTop: 2 }}>
            Task or alert
          </p>
        </div>
      </div>

      {/* Glass form panel */}
      <div className="form-panel">
        <EntryForm onSubmit={handleSubmit} loading={loading} validationErrors={validationErrors} />
      </div>
    </div>
  );
}
