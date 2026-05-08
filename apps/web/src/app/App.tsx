import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../ui/components/Layout.js';
import { EntryListPage } from '../ui/pages/EntryListPage.js';
import { CreateEntryPage } from '../ui/pages/CreateEntryPage.js';
import { useEntryStore } from '../store/entryStore.js';

function VisibilityRehydrator() {
  const checkMissedReminders = useEntryStore((s) => s.checkMissedReminders);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') checkMissedReminders();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [checkMissedReminders]);

  return null;
}

export function App() {
  return (
    <HashRouter>
      <VisibilityRehydrator />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/entries" replace />} />
          <Route path="entries" element={<EntryListPage />} />
          <Route path="entries/new" element={<CreateEntryPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
