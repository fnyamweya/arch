export interface TenantInfrastructureEntity {
  readonly tenantId: string;
  readonly d1DatabaseId: string;
  readonly kvNamespaceId: string;
  readonly r2BucketName: string;
  readonly queueName: string;
}
