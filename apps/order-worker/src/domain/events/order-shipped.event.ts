export interface OrderShippedEvent {
  readonly eventName: "order.shipped";
  readonly orderId: string;
  readonly trackingNumber: string;
  readonly occurredAt: string;
}
