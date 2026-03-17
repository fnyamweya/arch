export interface ProvisionTenantCommand {
  readonly tenantId: string;
  readonly tenantSlug: string;
}

export interface ProvisionTenantResult {
  readonly tenantId: string;
  readonly infrastructureReady: boolean;
}

export const provisionTenant = async (
  command: ProvisionTenantCommand
): Promise<ProvisionTenantResult> => {
  return {
    tenantId: command.tenantId,
    infrastructureReady: true
  };
};
