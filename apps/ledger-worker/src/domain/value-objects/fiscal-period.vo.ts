export type FiscalPeriodKey = string & { readonly __brand: "FiscalPeriodKey" };

export const toFiscalPeriodKey = (value: string): FiscalPeriodKey => {
  if (!/^\d{4}-\d{2}$/.test(value)) {
    throw new Error("fiscal period must be in YYYY-MM format");
  }
  return value as FiscalPeriodKey;
};
