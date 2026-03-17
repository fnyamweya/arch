export interface OrderTotalValue {
  readonly subtotalCents: number;
  readonly taxCents: number;
  readonly shippingCents: number;
  readonly totalCents: number;
}
