import type { CategoryEntity } from "../entities/category.entity";

export interface CategoryRepository {
  getById(categoryId: string): Promise<CategoryEntity | null>;
  save(category: CategoryEntity): Promise<void>;
}
