export interface JournalEntriesSchemaRecord {
  readonly id: string;
  readonly ledgerId: string;
  readonly referenceType: string;
  readonly referenceId: string;
  readonly status: string;
}
