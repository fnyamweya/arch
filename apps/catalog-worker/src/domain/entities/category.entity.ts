export interface CategoryEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly parentCategoryId: string | null;
}
