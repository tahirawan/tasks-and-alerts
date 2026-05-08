import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../ui/components/Layout.js';
import { EntryListPage } from '../ui/pages/EntryListPage.js';
import { CreateEntryPage } from '../ui/pages/CreateEntryPage.js';

export function App() {
  return (
    <HashRouter>
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
