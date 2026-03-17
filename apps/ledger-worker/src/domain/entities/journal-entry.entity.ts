export interface JournalEntryEntity {
  readonly id: string;
  readonly ledgerId: string;
  readonly referenceType: string;
  readonly referenceId: string;
  readonly status: string;
}
