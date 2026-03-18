import type { CloudflareClient } from "./cloudflare-client";

export interface KvProvisionResult {
  readonly namespaceId: string;
}

interface KvNamespaceRecord {
  readonly id: string;
  readonly title: string;
}

export class KvManager {
  private readonly client: CloudflareClient;
  private readonly accountId: string;

  public constructor(client: CloudflareClient, accountId: string) {
    this.client = client;
    this.accountId = accountId;
  }

  public async createNamespace(title: string): Promise<KvProvisionResult> {
    const response: {
      readonly result: {
        readonly id: string;
      };
    } = await this.client.request(`/accounts/${this.accountId}/storage/kv/namespaces`, {
      method: "POST",
      body: JSON.stringify({ title })
    });
    return { namespaceId: response.result.id };
  }

  public async findNamespaceByTitle(title: string): Promise<KvProvisionResult | null> {
    const response: {
      readonly result: ReadonlyArray<KvNamespaceRecord>;
    } = await this.client.request(`/accounts/${this.accountId}/storage/kv/namespaces`, {
      method: "GET"
    });

    const namespace = response.result.find((entry) => entry.title === title);
    return namespace === undefined ? null : { namespaceId: namespace.id };
  }
}
