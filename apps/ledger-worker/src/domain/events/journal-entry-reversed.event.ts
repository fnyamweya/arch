export interface JournalEntryReversedEvent {
  readonly eventName: "ledger.journal-entry.reversed";
  readonly journalEntryId: string;
  readonly reversalEntryId: string;
  readonly occurredAt: string;
}
