import type { JournalLineEntity } from "../../domain/entities/journal-line.entity";
import { validateDoubleEntry } from "../../domain/services/double-entry-validator.service";

export interface PostJournalEntryCommand {
  readonly ledgerId: string;
  readonly referenceType: string;
  readonly referenceId: string;
  readonly lines: ReadonlyArray<JournalLineEntity>;
}

export const postJournalEntry = async (
  command: PostJournalEntryCommand
): Promise<{ readonly journalEntryId: string }> => {
  if (command.lines.length < 2) {
    throw new Error("journal entry must contain at least two lines");
  }
  const hasInvalidAmounts: boolean = command.lines.some(
    (line) =>
      !Number.isInteger(line.debitAmountCents) ||
      !Number.isInteger(line.creditAmountCents) ||
      line.debitAmountCents < 0 ||
      line.creditAmountCents < 0 ||
      (line.debitAmountCents === 0 && line.creditAmountCents === 0) ||
      (line.debitAmountCents > 0 && line.creditAmountCents > 0)
  );
  if (hasInvalidAmounts) {
    throw new Error("journal lines must contain valid debit or credit integer cents");
  }
  if (!validateDoubleEntry(command.lines)) {
    throw new Error("journal entry is not balanced");
  }
  return { journalEntryId: `${command.ledgerId}:${command.referenceId}` };
};
