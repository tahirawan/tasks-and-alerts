import {
  type Entry,
  type EntryFilter,
  type IEntryRepository,
} from '@tasks-and-alerts/shared-types';

export async function listEntries(
  repository: IEntryRepository,
  filter?: EntryFilter,
): Promise<Entry[]> {
  return repository.listEntries(filter);
}
