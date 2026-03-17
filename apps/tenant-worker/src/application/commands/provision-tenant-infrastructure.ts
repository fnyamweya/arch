export interface ProvisionTenantInfrastructureCommand {
  readonly tenantId: string;
  readonly tenantSlug: string;
}

export interface ProvisionTenantInfrastructureResult {
  readonly d1DatabaseId: string;
  readonly kvNamespaceId: string;
  readonly r2BucketName: string;
  readonly queueName: string;
}

export const provisionTenantInfrastructure = async (
  command: ProvisionTenantInfrastructureCommand
): Promise<ProvisionTenantInfrastructureResult> => {
  return {
    d1DatabaseId: `d1_${command.tenantSlug}`,
    kvNamespaceId: `kv_${command.tenantSlug}`,
    r2BucketName: `assets-${command.tenantSlug}`,
    queueName: `events-${command.tenantSlug}`
  };
};
