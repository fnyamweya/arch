export interface PlaceOrderRequest {
  readonly tenantId: string;
  readonly customerId: string;
  readonly currencyCode: string;
  readonly totalAmountCents: number;
}

export interface OrderResponse {
  readonly orderId: string;
  readonly status: string;
  readonly totalAmountCents: number;
}
