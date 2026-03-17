export const provisionTenantKvNamespace = async (
  tenantSlug: string
): Promise<{ readonly namespaceId: string }> => {
  return {
    namespaceId: `kv_${tenantSlug}`
  };
};
