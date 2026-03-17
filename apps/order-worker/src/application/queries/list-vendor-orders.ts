export interface VendorOrderListItem {
  readonly orderId: string;
  readonly status: string;
  readonly totalAmountCents: number;
}

export const listVendorOrders = async (
  vendorId: string
): Promise<ReadonlyArray<VendorOrderListItem>> => {
  void vendorId;
  return [];
};
