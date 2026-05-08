import { create } from 'zustand';
import type {
  CreateEntryInput,
  Entry,
  EntryFilter,
  UpdateEntryInput,
} from '@tasks-and-alerts/shared-types';
import {
  createEntry,
  updateEntry,
  deleteEntry,
  listEntries,
  CreateEntryError,
} from '@tasks-and-alerts/shared-core';
import { db } from '../infrastructure/storage/AppDatabase.js';
import { LocalEntryRepository } from '../infrastructure/storage/LocalEntryRepository.js';
import { BrowserNotificationService } from '../infrastructure/notifications/BrowserNotificationService.js';

const repository = new LocalEntryRepository(db);
const notificationService = new BrowserNotificationService();

interface EntryStoreState {
  entries: Entry[];
  loading: boolean;
  error: string | null;
  validationErrors: { field: string; message: string }[];

  loadEntries: (filter?: EntryFilter) => Promise<void>;
  addEntry: (input: CreateEntryInput) => Promise<Entry | null>;
  editEntry: (id: string, patch: UpdateEntryInput) => Promise<Entry | null>;
  removeEntry: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useEntryStore = create<EntryStoreState>((set, _get) => ({
  entries: [],
  loading: false,
  error: null,
  validationErrors: [],

  loadEntries: async (filter) => {
    set({ loading: true, error: null });
    try {
      const entries = await listEntries(repository, filter);
      set({ entries, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  addEntry: async (input) => {
    set({ loading: true, error: null, validationErrors: [] });
    try {
      const entry = await createEntry(input, repository, notificationService);
      set((state) => ({
        entries: [...state.entries, entry].sort(
          (a, b) =>
            new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime(),
        ),
        loading: false,
      }));
      return entry;
    } catch (e) {
      if (e instanceof CreateEntryError) {
        set({ validationErrors: e.validationErrors, loading: false });
      } else {
        set({ error: String(e), loading: false });
      }
      return null;
    }
  },

  editEntry: async (id, patch) => {
    set({ loading: true, error: null });
    try {
      const entry = await updateEntry(id, patch, repository, notificationService);
      set((state) => ({
        entries: state.entries.map((e) => (e.id === id ? entry : e)),
        loading: false,
      }));
      return entry;
    } catch (e) {
      set({ error: String(e), loading: false });
      return null;
    }
  },

  removeEntry: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteEntry(id, repository, notificationService);
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  clearError: () => set({ error: null, validationErrors: [] }),
}));
