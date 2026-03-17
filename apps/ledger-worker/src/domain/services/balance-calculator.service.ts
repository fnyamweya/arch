import type { JournalLineEntity } from "../entities/journal-line.entity";

export const calculateBalanceCents = (lines: ReadonlyArray<JournalLineEntity>): number => {
  return lines.reduce((sum, line) => sum + line.debitAmountCents - line.creditAmountCents, 0);
};
