export interface RefundEntity {
  readonly id: string;
  readonly orderId: string;
  readonly amountCents: number;
  readonly reason: string;
  readonly status: string;
}
