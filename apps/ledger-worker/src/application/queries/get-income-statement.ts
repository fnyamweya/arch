export interface IncomeStatementView {
  readonly revenueCents: number;
  readonly expenseCents: number;
  readonly netIncomeCents: number;
}

export const getIncomeStatement = async (
  ledgerId: string,
  periodKey: string
): Promise<IncomeStatementView> => {
  void ledgerId;
  void periodKey;
  return { revenueCents: 0, expenseCents: 0, netIncomeCents: 0 };
};
