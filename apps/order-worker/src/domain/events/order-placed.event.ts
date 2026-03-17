export interface OrderPlacedEvent {
  readonly eventName: "order.placed";
  readonly orderId: string;
  readonly occurredAt: string;
}
