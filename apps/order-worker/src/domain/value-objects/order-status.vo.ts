export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FULFILLED: "FULFILLED",
  CANCELLED: "CANCELLED"
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
