export interface TrialBalanceLine {
  readonly accountId: string;
  readonly debitAmountCents: number;
  readonly creditAmountCents: number;
}

export const getTrialBalance = async (
  ledgerId: string,
  periodKey: string
): Promise<ReadonlyArray<TrialBalanceLine>> => {
  void ledgerId;
  void periodKey;
  return [];
};
