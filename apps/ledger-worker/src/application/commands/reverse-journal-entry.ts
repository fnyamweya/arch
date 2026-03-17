export interface ReverseJournalEntryCommand {
  readonly journalEntryId: string;
  readonly reason: string;
}

export const reverseJournalEntry = async (
  command: ReverseJournalEntryCommand
): Promise<{ readonly reversalEntryId: string }> => {
  if (command.reason.trim().length < 3) {
    throw new Error("reversal reason must be at least 3 characters");
  }
  return { reversalEntryId: `reversal:${command.journalEntryId}` };
};
