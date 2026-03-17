import type { CategoryEntity } from "../../domain/entities/category.entity";
import type { CategoryRepository } from "../../domain/repositories/category.repository";
import { categoriesTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1CategoryRepository implements CategoryRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(categoryId: string): Promise<CategoryEntity | null> {
    const rows = await this.db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId)).limit(1);
    const row = rows[0];
    if (row === undefined) {
      return null;
    }
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      parentCategoryId: row.parentCategoryId
    };
  }

  public async save(category: CategoryEntity): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(categoriesTable)
      .values({
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentCategoryId: category.parentCategoryId,
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: categoriesTable.id,
        set: {
          name: category.name,
          slug: category.slug,
          parentCategoryId: category.parentCategoryId,
          updatedAt: now
        }
      });
  }
}
