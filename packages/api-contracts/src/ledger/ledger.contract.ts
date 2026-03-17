export interface PostJournalEntryRequest {
  readonly ledgerId: string;
  readonly referenceType: string;
  readonly referenceId: string;
  readonly lines: ReadonlyArray<{
    readonly id: string;
    readonly journalEntryId: string;
    readonly accountId: string;
    readonly debitAmountCents: number;
    readonly creditAmountCents: number;
  }>;
}

export interface JournalEntryResponse {
  readonly journalEntryId: string;
}
