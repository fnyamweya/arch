export const formatCurrency = (amountCents: number, currency: string): string => {
  return `${currency} ${(amountCents / 100).toFixed(2)}`;
};
