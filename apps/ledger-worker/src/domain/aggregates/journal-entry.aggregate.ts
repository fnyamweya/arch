import type { JournalEntryEntity } from "../entities/journal-entry.entity";
import type { JournalLineEntity } from "../entities/journal-line.entity";

export interface JournalEntryAggregate {
  readonly entry: JournalEntryEntity;
  readonly lines: ReadonlyArray<JournalLineEntity>;
}
