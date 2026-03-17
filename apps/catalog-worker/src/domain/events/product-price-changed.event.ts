export interface ProductPriceChangedEvent {
  readonly eventName: "catalog.product.price.changed";
  readonly productId: string;
  readonly variantId: string;
  readonly occurredAt: string;
}
