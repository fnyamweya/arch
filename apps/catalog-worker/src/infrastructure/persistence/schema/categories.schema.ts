export interface CategoriesSchemaRecord {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly parentCategoryId: string | null;
}
