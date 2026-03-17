export const provisionTenantD1Database = async (
  tenantSlug: string
): Promise<{ readonly databaseId: string }> => {
  return {
    databaseId: `d1_${tenantSlug}`
  };
};
