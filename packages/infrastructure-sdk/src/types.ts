export interface CloudflareApiConfig {
  readonly accountId: string;
  readonly apiToken: string;
  readonly apiBaseUrl: string;
}

export interface ProvisionedTenantInfrastructure {
  readonly d1DatabaseId: string;
  readonly kvNamespaceId: string;
  readonly r2BucketName: string;
  readonly queueName: string;
}
