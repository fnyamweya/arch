export interface OrderLineItemEntity {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly unitPriceAmountCents: number;
  readonly lineTotalAmountCents: number;
}
