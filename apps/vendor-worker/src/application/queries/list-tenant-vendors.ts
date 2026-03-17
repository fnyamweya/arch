export interface TenantVendorListItem {
  readonly vendorId: string;
  readonly displayName: string;
  readonly status: string;
}

export const listTenantVendors = async (
  tenantId: string
): Promise<ReadonlyArray<TenantVendorListItem>> => {
  void tenantId;
  return [];
};
