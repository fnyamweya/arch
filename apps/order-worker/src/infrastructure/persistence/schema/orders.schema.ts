export interface OrdersSchemaRecord {
  readonly id: string;
  readonly customerId: string;
  readonly status: string;
  readonly totalAmountCents: number;
}
