export interface OrderEntity {
  readonly id: string;
  readonly customerId: string;
  readonly status: string;
  readonly totalAmountCents: number;
  readonly currencyCode: string;
}
