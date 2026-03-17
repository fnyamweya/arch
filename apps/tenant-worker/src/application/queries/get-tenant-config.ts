export interface TenantConfigView {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly status: string;
}

export const getTenantConfig = async (tenantId: string): Promise<TenantConfigView | null> => {
  return {
    tenantId,
    tenantSlug: tenantId,
    status: "ACTIVE"
  };
};
