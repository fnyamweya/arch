import type { JournalEntryAggregate } from "../aggregates/journal-entry.aggregate";

export interface JournalEntryRepository {
  getById(journalEntryId: string): Promise<JournalEntryAggregate | null>;
  save(journalEntry: JournalEntryAggregate): Promise<void>;
}
