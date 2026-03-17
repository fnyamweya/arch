export interface CustomerOrderListItem {
  readonly orderId: string;
  readonly status: string;
  readonly totalAmountCents: number;
}

export const listCustomerOrders = async (
  customerId: string
): Promise<ReadonlyArray<CustomerOrderListItem>> => {
  void customerId;
  return [];
};
