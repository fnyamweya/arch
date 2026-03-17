export interface ProductPublishedEvent {
  readonly eventName: "catalog.product.published";
  readonly productId: string;
  readonly occurredAt: string;
}
