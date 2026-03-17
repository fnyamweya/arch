export type LedgerAmountCents = number & { readonly __brand: "LedgerAmountCents" };

export const toLedgerAmountCents = (value: number): LedgerAmountCents => {
  if (!Number.isInteger(value)) {
    throw new Error("ledger amount must be integer cents");
  }
  return value as LedgerAmountCents;
};
