export interface ClerkConfigurationsSchemaRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly clerkPublishableKey: string;
  readonly clerkSecretKeyEncrypted: string;
  readonly clerkWebhookSecret: string;
  readonly clerkAuthDomain: string | null;
  readonly clerkProxyUrl: string | null;
  readonly clerkJwksUrl: string;
}
