import type {
  DataSource,
  EntryStatus,
  EntryType,
  ReminderMode,
  ReminderOffsetUnit,
  SyncStatus,
} from './enums.js';

export interface ReminderRule {
  mode: ReminderMode;
  offsetValue?: number;
  offsetUnit?: ReminderOffsetUnit;
  computedReminderDateTime?: string; // ISO 8601
}

export interface Entry {
  id: string;
  type: EntryType;
  title: string;
  notes?: string;
  scheduledDateTime: string; // ISO 8601
  isTodayOnlyTimeEntry: boolean;
  reminder: ReminderRule;
  status: EntryStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  source: DataSource;
  syncStatus: SyncStatus;
}

export type CreateEntryInput = Omit<
  Entry,
  'id' | 'createdAt' | 'updatedAt' | 'source' | 'syncStatus' | 'status'
> & {
  status?: EntryStatus;
};

export type UpdateEntryInput = Partial<
  Omit<Entry, 'id' | 'createdAt' | 'source' | 'syncStatus'>
>;
