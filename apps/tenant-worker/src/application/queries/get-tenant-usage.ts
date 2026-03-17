export interface TenantUsageView {
  readonly tenantId: string;
  readonly productCount: number;
  readonly vendorCount: number;
  readonly storageMb: number;
}

export const getTenantUsage = async (tenantId: string): Promise<TenantUsageView> => {
  return { tenantId, productCount: 0, vendorCount: 0, storageMb: 0 };
};
