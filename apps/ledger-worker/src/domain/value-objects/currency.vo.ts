export const CURRENCY_CODE = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  KES: "KES"
} as const;

export type CurrencyCode = (typeof CURRENCY_CODE)[keyof typeof CURRENCY_CODE];
