export interface OrderAnalyticsView {
  readonly totalOrders: number;
  readonly totalRevenueCents: number;
  readonly averageOrderValueCents: number;
}

export const getOrderAnalytics = async (): Promise<OrderAnalyticsView> => {
  return { totalOrders: 0, totalRevenueCents: 0, averageOrderValueCents: 0 };
};
