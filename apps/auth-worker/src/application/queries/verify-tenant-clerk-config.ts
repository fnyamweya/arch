export interface TenantClerkConfigVerificationView {
  readonly tenantId: string;
  readonly isConfigured: boolean;
  readonly hasWebhookSecret: boolean;
}

export const verifyTenantClerkConfig = async (
  tenantId: string
): Promise<TenantClerkConfigVerificationView> => {
  return {
    tenantId,
    isConfigured: false,
    hasWebhookSecret: false
  };
};
