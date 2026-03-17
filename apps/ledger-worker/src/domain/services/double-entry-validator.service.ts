import type { JournalLineEntity } from "../entities/journal-line.entity";

export const validateDoubleEntry = (lines: ReadonlyArray<JournalLineEntity>): boolean => {
  const debitTotal: number = lines.reduce((sum, line) => sum + line.debitAmountCents, 0);
  const creditTotal: number = lines.reduce((sum, line) => sum + line.creditAmountCents, 0);
  return lines.length >= 2 && debitTotal === creditTotal;
};
