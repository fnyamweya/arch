export interface ProductDetailView {
  readonly productId: string;
  readonly title: string;
  readonly slug: string;
  readonly status: string;
}

export const getProductDetail = async (productId: string): Promise<ProductDetailView | null> => {
  void productId;
  return null;
};
