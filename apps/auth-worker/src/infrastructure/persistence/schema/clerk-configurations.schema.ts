export interface ClerkConfigurationsSchemaRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly clerkPublishableKey: string;
  readonly clerkSecretKeyEncrypted: string;
  readonly clerkWebhookSecret: string;
  readonly clerkJwksUrl: string;
}
