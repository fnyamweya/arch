import type { ProductAggregate } from "../aggregates/product.aggregate";

export interface ProductRepository {
  getById(productId: string): Promise<ProductAggregate | null>;
  save(product: ProductAggregate): Promise<void>;
}
