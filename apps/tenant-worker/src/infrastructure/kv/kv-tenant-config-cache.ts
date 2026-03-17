export const cacheTenantConfig = async (
  namespace: KVNamespace,
  tenantId: string,
  payload: string
): Promise<void> => {
  await namespace.put(`tenant-config:${tenantId}`, payload, { expirationTtl: 60 });
};

export const getCachedTenantConfig = async (
  namespace: KVNamespace,
  tenantId: string
): Promise<string | null> => {
  return namespace.get(`tenant-config:${tenantId}`);
};
