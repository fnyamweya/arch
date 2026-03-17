export interface VendorCatalogItemView {
  readonly productId: string;
  readonly title: string;
  readonly status: string;
}

export const getVendorCatalog = async (
  vendorId: string
): Promise<ReadonlyArray<VendorCatalogItemView>> => {
  void vendorId;
  return [];
};
