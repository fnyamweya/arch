import type { OrderTotalValue } from "../value-objects/order-total.vo";

export const calculateOrderTotal = (
  subtotalCents: number,
  taxCents: number,
  shippingCents: number
): OrderTotalValue => {
  if (
    !Number.isInteger(subtotalCents) ||
    !Number.isInteger(taxCents) ||
    !Number.isInteger(shippingCents) ||
    subtotalCents < 0 ||
    taxCents < 0 ||
    shippingCents < 0
  ) {
    throw new Error("order totals must be non-negative integer cents");
  }
  return {
    subtotalCents,
    taxCents,
    shippingCents,
    totalCents: subtotalCents + taxCents + shippingCents
  };
};
