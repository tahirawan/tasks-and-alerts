import type { Entry, UpdateEntryInput } from './entry.types.js';
import type { EntryStatus, EntryType } from './enums.js';

export interface EntryFilter {
  type?: EntryType;
  status?: EntryStatus;
  fromDate?: string;
  toDate?: string;
}

export interface IEntryRepository {
  listEntries(filter?: EntryFilter): Promise<Entry[]>;
  getEntry(id: string): Promise<Entry | null>;
  createEntry(entry: Entry): Promise<Entry>;
  updateEntry(id: string, patch: UpdateEntryInput): Promise<Entry>;
  deleteEntry(id: string): Promise<void>;
  exportData(): Promise<Entry[]>;
  importData(entries: Entry[]): Promise<void>;
}
