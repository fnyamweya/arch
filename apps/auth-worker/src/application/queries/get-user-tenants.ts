export interface UserTenantView {
  readonly tenantId: string;
  readonly role: string;
}

export const getUserTenants = async (
  userId: string
): Promise<ReadonlyArray<UserTenantView>> => {
  void userId;
  return [];
};
