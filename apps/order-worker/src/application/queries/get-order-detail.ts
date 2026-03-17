export interface OrderDetailView {
  readonly orderId: string;
  readonly status: string;
  readonly totalAmountCents: number;
}

export const getOrderDetail = async (orderId: string): Promise<OrderDetailView | null> => {
  void orderId;
  return null;
};
