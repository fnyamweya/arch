export const ENTRY_STATUS = {
  PENDING: "PENDING",
  POSTED: "POSTED",
  REVERSED: "REVERSED"
} as const;

export type EntryStatus = (typeof ENTRY_STATUS)[keyof typeof ENTRY_STATUS];
