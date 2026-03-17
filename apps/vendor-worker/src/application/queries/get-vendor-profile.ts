export interface VendorProfileView {
  readonly vendorId: string;
  readonly displayName: string;
  readonly status: string;
}

export const getVendorProfile = async (vendorId: string): Promise<VendorProfileView | null> => {
  void vendorId;
  return null;
};
