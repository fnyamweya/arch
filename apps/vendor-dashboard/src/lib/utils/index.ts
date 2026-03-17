export const formatAmount = (amountCents: number, currencyCode: string): string => {
  return `${currencyCode} ${(amountCents / 100).toFixed(2)}`;
};
