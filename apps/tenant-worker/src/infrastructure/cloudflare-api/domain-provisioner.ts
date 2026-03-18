export const provisionTenantDomain = async (
  tenantSlug: string
): Promise<{ readonly domain: string }> => {
  return {
    domain: `${tenantSlug}.africasokoni.co.ke`
  };
};
