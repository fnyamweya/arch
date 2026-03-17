import type { ProductEntity } from "../entities/product.entity";
import type { ProductVariantEntity } from "../entities/product-variant.entity";

export interface ProductAggregate {
  readonly product: ProductEntity;
  readonly variants: ReadonlyArray<ProductVariantEntity>;
}
