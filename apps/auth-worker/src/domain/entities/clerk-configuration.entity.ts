import type { TenantId } from "../value-objects/tenant-id.vo";

export interface ClerkConfigurationEntity {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly publishableKey: string;
  readonly encryptedSecretKey: string;
  readonly webhookSecret: string;
  readonly authDomain: string | null;
  readonly proxyUrl: string | null;
  readonly jwksUrl: string;
}
