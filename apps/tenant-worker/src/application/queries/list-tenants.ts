export interface TenantListItemView {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly status: string;
}

export const listTenants = async (): Promise<ReadonlyArray<TenantListItemView>> => {
  return [];
};
