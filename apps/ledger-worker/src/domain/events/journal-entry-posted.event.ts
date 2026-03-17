export interface JournalEntryPostedEvent {
  readonly eventName: "ledger.journal-entry.posted";
  readonly journalEntryId: string;
  readonly occurredAt: string;
}
