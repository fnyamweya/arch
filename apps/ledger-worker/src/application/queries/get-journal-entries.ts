export interface JournalEntryListItem {
  readonly journalEntryId: string;
  readonly referenceType: string;
  readonly referenceId: string;
  readonly status: string;
}

export const getJournalEntries = async (
  ledgerId: string
): Promise<ReadonlyArray<JournalEntryListItem>> => {
  void ledgerId;
  return [];
};
