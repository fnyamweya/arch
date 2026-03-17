export interface PlatformRevenueReportView {
  readonly periodKey: string;
  readonly grossCommissionCents: number;
  readonly netRevenueCents: number;
}

export const getPlatformRevenueReport = async (
  periodKey: string
): Promise<PlatformRevenueReportView> => {
  return { periodKey, grossCommissionCents: 0, netRevenueCents: 0 };
};
