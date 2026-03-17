import { encryptClerkSecretKey } from "../../infrastructure/security/clerk-key-encryption";

export interface ConfigureTenantClerkKeysCommand {
  readonly tenantId: string;
  readonly clerkPublishableKey: string;
  readonly clerkSecretKey: string;
  readonly clerkWebhookSecret: string;
  readonly encryptionSecret: string;
}

export const configureTenantClerkKeys = async (
  command: ConfigureTenantClerkKeysCommand
): Promise<{ readonly configured: boolean; readonly encryptedSecretKey: string }> => {
  const encryptedSecretKey: string = await encryptClerkSecretKey(
    command.clerkSecretKey,
    command.encryptionSecret
  );
  return {
    configured: true,
    encryptedSecretKey
  };
};
