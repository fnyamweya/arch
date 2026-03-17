export interface TenantFinancialSummaryView {
  readonly tenantId: string;
  readonly totalRevenueCents: number;
  readonly totalCommissionCents: number;
  readonly totalPayoutCents: number;
}

export const getTenantFinancialSummary = async (
  tenantId: string
): Promise<TenantFinancialSummaryView> => {
  return { tenantId, totalRevenueCents: 0, totalCommissionCents: 0, totalPayoutCents: 0 };
};
