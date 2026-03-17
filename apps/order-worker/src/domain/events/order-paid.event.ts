export interface OrderPaidEvent {
  readonly eventName: "order.paid";
  readonly orderId: string;
  readonly occurredAt: string;
}
