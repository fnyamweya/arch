export const ENTRY_DIRECTION = {
  DEBIT: "DEBIT",
  CREDIT: "CREDIT"
} as const;

export type EntryDirection = (typeof ENTRY_DIRECTION)[keyof typeof ENTRY_DIRECTION];
