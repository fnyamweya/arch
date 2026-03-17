export interface VendorStatementView {
  readonly vendorId: string;
  readonly earningsCents: number;
  readonly commissionCents: number;
  readonly payoutCents: number;
}

export const getVendorStatement = async (
  ledgerId: string,
  vendorId: string
): Promise<VendorStatementView> => {
  void ledgerId;
  return { vendorId, earningsCents: 0, commissionCents: 0, payoutCents: 0 };
};
