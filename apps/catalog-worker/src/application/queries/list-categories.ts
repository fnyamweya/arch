export interface CategoryListItemView {
  readonly categoryId: string;
  readonly name: string;
  readonly slug: string;
}

export const listCategories = async (): Promise<ReadonlyArray<CategoryListItemView>> => {
  return [];
};
