export const provisionTenantQueue = async (
  tenantSlug: string
): Promise<{ readonly queueName: string }> => {
  return {
    queueName: `events-${tenantSlug}`
  };
};
