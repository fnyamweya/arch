import {
  CloudflareClient,
  D1Manager,
  DomainManager,
  KvManager,
  QueueManager,
  R2Manager,
  type D1ProvisionResult,
  type KvProvisionResult,
  type ProvisionedTenantInfrastructure,
  type QueueProvisionResult,
  type R2ProvisionResult
} from "@arch/infrastructure-sdk";

export interface ProvisionTenantCommand {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly primaryDomain: string;
  readonly cloudflareAccountId: string;
  readonly cloudflareApiToken: string;
  readonly gatewayWorkerService: string;
  readonly gatewayWorkerEnvironment?: string;
}

export interface ProvisionTenantResult {
  readonly tenantId: string;
  readonly infrastructureReady: boolean;
  readonly d1DatabaseId: string;
  readonly kvNamespaceId: string;
  readonly r2BucketName: string;
  readonly queueName: string;
}

const buildInfrastructureNames = (
  command: ProvisionTenantCommand
): {
  readonly d1DatabaseName: string;
  readonly kvNamespaceTitle: string;
  readonly r2BucketName: string;
  readonly queueName: string;
} => {
  const normalizedSlug = command.tenantSlug.trim().toLowerCase();
  const normalizedTenantId = command.tenantId.trim().toLowerCase();
  const resourcePrefix = `tenant-${normalizedSlug}-${normalizedTenantId}`;

  return {
    d1DatabaseName: `${resourcePrefix}-d1`,
    kvNamespaceTitle: `${resourcePrefix}-kv`,
    r2BucketName: `${resourcePrefix}-assets`,
    queueName: `${resourcePrefix}-events`
  };
};

const provisionOrReuse = async <TProvisioned>(
  findExisting: () => Promise<TProvisioned | null>,
  create: () => Promise<TProvisioned>
): Promise<TProvisioned> => {
  const existing = await findExisting();
  if (existing !== null) {
    return existing;
  }

  try {
    return await create();
  } catch {
    const afterFailure = await findExisting();
    if (afterFailure !== null) {
      return afterFailure;
    }
    throw new Error("Cloudflare resource provisioning failed before the resource could be reused.");
  }
};

const provisionInfrastructure = async (
  command: ProvisionTenantCommand
): Promise<ProvisionedTenantInfrastructure> => {
  const client = new CloudflareClient({
    accountId: command.cloudflareAccountId,
    apiToken: command.cloudflareApiToken,
    apiBaseUrl: "https://api.cloudflare.com/client/v4"
  });
  const d1Manager = new D1Manager(client, command.cloudflareAccountId);
  const kvManager = new KvManager(client, command.cloudflareAccountId);
  const r2Manager = new R2Manager(client, command.cloudflareAccountId);
  const queueManager = new QueueManager(client, command.cloudflareAccountId);
  const domainManager = new DomainManager(client, command.cloudflareAccountId);
  const names = buildInfrastructureNames(command);

  const [database, namespace, bucket, queue] = await Promise.all([
    provisionOrReuse<D1ProvisionResult>(
      () => d1Manager.findDatabaseByName(names.d1DatabaseName),
      () => d1Manager.createDatabase(names.d1DatabaseName)
    ),
    provisionOrReuse<KvProvisionResult>(
      () => kvManager.findNamespaceByTitle(names.kvNamespaceTitle),
      () => kvManager.createNamespace(names.kvNamespaceTitle)
    ),
    provisionOrReuse<R2ProvisionResult>(
      () => r2Manager.findBucket(names.r2BucketName),
      () => r2Manager.createBucket(names.r2BucketName)
    ),
    provisionOrReuse<QueueProvisionResult>(
      () => queueManager.findQueue(names.queueName),
      () => queueManager.createQueue(names.queueName)
    )
  ]);

  if (command.gatewayWorkerService.trim().length > 0) {
    await domainManager.mapWorkerDomain({
      hostname: command.primaryDomain,
      service: command.gatewayWorkerService,
      environment: command.gatewayWorkerEnvironment
    });
  }

  return {
    d1DatabaseId: database.databaseId,
    kvNamespaceId: namespace.namespaceId,
    r2BucketName: bucket.bucketName,
    queueName: queue.queueName
  };
};

export const provisionTenant = async (
  command: ProvisionTenantCommand
): Promise<ProvisionTenantResult> => {
  const infrastructure = await provisionInfrastructure(command);

  return {
    tenantId: command.tenantId,
    infrastructureReady: true,
    d1DatabaseId: infrastructure.d1DatabaseId,
    kvNamespaceId: infrastructure.kvNamespaceId,
    r2BucketName: infrastructure.r2BucketName,
    queueName: infrastructure.queueName
  };
};
