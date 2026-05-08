import Dexie, { type EntityTable } from 'dexie';
import type { Entry } from '@tasks-and-alerts/shared-types';

export class AppDatabase extends Dexie {
  entries!: EntityTable<Entry, 'id'>;

  constructor(options?: ConstructorParameters<typeof Dexie>[1]) {
    super('TasksAndAlertsDB', options);

    this.version(1).stores({
      entries:
        'id, type, status, scheduledDateTime, createdAt, updatedAt, syncStatus',
    });
  }
}

export const db = new AppDatabase();
