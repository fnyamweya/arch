export interface TenantInfrastructureStatusView {
  readonly tenantId: string;
  readonly d1Ready: boolean;
  readonly kvReady: boolean;
  readonly r2Ready: boolean;
  readonly queueReady: boolean;
}

export const getTenantInfrastructureStatus = async (
  tenantId: string
): Promise<TenantInfrastructureStatusView> => {
  return {
    tenantId,
    d1Ready: false,
    kvReady: false,
    r2Ready: false,
    queueReady: false
  };
};
