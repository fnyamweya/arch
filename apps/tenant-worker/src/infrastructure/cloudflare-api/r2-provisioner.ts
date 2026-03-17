export const provisionTenantR2Bucket = async (
  tenantSlug: string
): Promise<{ readonly bucketName: string }> => {
  return {
    bucketName: `assets-${tenantSlug}`
  };
};
