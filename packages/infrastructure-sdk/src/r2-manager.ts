import type { CloudflareClient } from "./cloudflare-client";

export interface R2ProvisionResult {
  readonly bucketName: string;
}

export class R2Manager {
  private readonly client: CloudflareClient;
  private readonly accountId: string;

  public constructor(client: CloudflareClient, accountId: string) {
    this.client = client;
    this.accountId = accountId;
  }

  public async createBucket(name: string): Promise<R2ProvisionResult> {
    await this.client.request(`/accounts/${this.accountId}/r2/buckets`, {
      method: "POST",
      body: JSON.stringify({ name })
    });
    return { bucketName: name };
  }
}
