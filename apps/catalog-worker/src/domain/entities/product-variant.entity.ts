export interface ProductVariantEntity {
  readonly id: string;
  readonly productId: string;
  readonly sku: string;
  readonly title: string;
  readonly priceAmountCents: number;
  readonly currencyCode: string;
  readonly inventoryQuantity: number;
}
