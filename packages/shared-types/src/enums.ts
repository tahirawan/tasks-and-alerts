export enum EntryType {
  Task = 'task',
  Alert = 'alert',
}

export enum EntryStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Archived = 'archived',
}

export enum ReminderMode {
  AtTime = 'at_time',
  BeforeTime = 'before_time',
  None = 'none',
}

export enum ReminderOffsetUnit {
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days',
}

export enum SyncStatus {
  LocalOnly = 'local_only',
  PendingSync = 'pending_sync',
  Synced = 'synced',
  Conflict = 'conflict',
}

export enum DataSource {
  Local = 'local',
  Synced = 'synced',
}
