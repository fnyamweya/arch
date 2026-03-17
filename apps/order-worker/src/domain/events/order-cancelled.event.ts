export interface OrderCancelledEvent {
  readonly eventName: "order.cancelled";
  readonly orderId: string;
  readonly reason: string;
  readonly occurredAt: string;
}
