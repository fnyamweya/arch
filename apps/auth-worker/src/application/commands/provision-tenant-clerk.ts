export interface ProvisionTenantClerkCommand {
  readonly tenantId: string;
  readonly tenantSlug: string;
}

export const provisionTenantClerk = async (
  command: ProvisionTenantClerkCommand
): Promise<{ readonly clerkOrganizationId: string }> => {
  return { clerkOrganizationId: `org_${command.tenantSlug}` };
};
