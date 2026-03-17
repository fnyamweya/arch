export interface ProductCreatedEvent {
  readonly eventName: "catalog.product.created";
  readonly productId: string;
  readonly occurredAt: string;
}
