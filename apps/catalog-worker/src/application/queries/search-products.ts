export interface SearchProductsQuery {
  readonly tenantId: string;
  readonly searchTerm: string;
}

export interface ProductSearchItem {
  readonly productId: string;
  readonly title: string;
  readonly status: string;
}

export const searchProducts = async (
  query: SearchProductsQuery
): Promise<ReadonlyArray<ProductSearchItem>> => {
  void query;
  return [];
};
