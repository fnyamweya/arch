export interface VendorAnalyticsView {
  readonly vendorId: string;
  readonly totalOrders: number;
  readonly totalRevenueCents: number;
}

export const getVendorAnalytics = async (vendorId: string): Promise<VendorAnalyticsView> => {
  return { vendorId, totalOrders: 0, totalRevenueCents: 0 };
};
