export interface JournalLineEntity {
  readonly id: string;
  readonly journalEntryId: string;
  readonly accountId: string;
  readonly debitAmountCents: number;
  readonly creditAmountCents: number;
}
