export interface AccountBalanceView {
  readonly accountId: string;
  readonly balanceCents: number;
}

export const getAccountBalance = async (accountId: string): Promise<AccountBalanceView> => {
  return { accountId, balanceCents: 0 };
};
