export interface BalanceSheetView {
  readonly assetsCents: number;
  readonly liabilitiesCents: number;
  readonly equityCents: number;
}

export const getBalanceSheet = async (ledgerId: string): Promise<BalanceSheetView> => {
  void ledgerId;
  return { assetsCents: 0, liabilitiesCents: 0, equityCents: 0 };
};
