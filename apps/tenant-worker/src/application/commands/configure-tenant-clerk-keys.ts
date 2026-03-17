export interface ConfigureTenantClerkKeysCommand {
  readonly tenantId: string;
  readonly clerkPublishableKey: string;
  readonly clerkSecretKeyEncrypted: string;
}

export const configureTenantClerkKeys = async (
  command: ConfigureTenantClerkKeysCommand
): Promise<{ readonly configured: boolean }> => {
  void command;
  return { configured: true };
};
