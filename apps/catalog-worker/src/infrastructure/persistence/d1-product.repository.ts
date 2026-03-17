import type { ProductAggregate } from "../../domain/aggregates/product.aggregate";
import type { ProductRepository } from "../../domain/repositories/product.repository";
import { productsTable, variantsTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1ProductRepository implements ProductRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(productId: string): Promise<ProductAggregate | null> {
    const productRows = await this.db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
    const product = productRows[0];
    if (product === undefined) {
      return null;
    }
    const variantRows = await this.db.select().from(variantsTable).where(eq(variantsTable.productId, productId));
    return {
      product: {
        id: product.id,
        vendorId: product.vendorId,
        title: product.title,
        slug: product.slug,
        status: product.status
      },
      variants: variantRows.map((variant) => ({
        id: variant.id,
        productId: variant.productId,
        sku: variant.sku,
        title: variant.title,
        priceAmountCents: variant.priceAmountCents,
        currencyCode: variant.currencyCode,
        inventoryQuantity: variant.inventoryQuantity
      }))
    };
  }

  public async save(product: ProductAggregate): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(productsTable)
      .values({
        id: product.product.id,
        vendorId: product.product.vendorId,
        title: product.product.title,
        slug: product.product.slug,
        description: null,
        status: product.product.status,
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: productsTable.id,
        set: {
          vendorId: product.product.vendorId,
          title: product.product.title,
          slug: product.product.slug,
          status: product.product.status,
          updatedAt: now
        }
      });
    for (const variant of product.variants) {
      await this.db
        .insert(variantsTable)
        .values({
          id: variant.id,
          productId: variant.productId,
          sku: variant.sku,
          title: variant.title,
          priceAmountCents: variant.priceAmountCents,
          currencyCode: variant.currencyCode,
          inventoryQuantity: variant.inventoryQuantity,
          createdAt: now,
          updatedAt: now
        })
        .onConflictDoUpdate({
          target: variantsTable.id,
          set: {
            title: variant.title,
            priceAmountCents: variant.priceAmountCents,
            currencyCode: variant.currencyCode,
            inventoryQuantity: variant.inventoryQuantity,
            updatedAt: now
          }
        });
    }
  }
}
