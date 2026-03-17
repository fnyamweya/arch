export interface OrderItemsSchemaRecord {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly lineTotalAmountCents: number;
}
