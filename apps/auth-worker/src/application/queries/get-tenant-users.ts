export interface TenantUserView {
  readonly userId: string;
  readonly email: string | null;
  readonly role: string;
}

export const getTenantUsers = async (
  tenantId: string
): Promise<ReadonlyArray<TenantUserView>> => {
  void tenantId;
  return [];
};
