import type { CloudflareClient } from "./cloudflare-client";

export interface KvProvisionResult {
  readonly namespaceId: string;
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
}
