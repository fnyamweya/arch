import type { CloudflareClient } from "./cloudflare-client";

export interface R2ProvisionResult {
  readonly bucketName: string;
}

interface R2BucketRecord {
  readonly name: string;
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

  public async findBucket(name: string): Promise<R2ProvisionResult | null> {
    const response: {
      readonly result: ReadonlyArray<R2BucketRecord> | { readonly buckets?: ReadonlyArray<R2BucketRecord> };
    } = await this.client.request(`/accounts/${this.accountId}/r2/buckets`, {
      method: "GET"
    });

    let buckets: ReadonlyArray<R2BucketRecord> = [];

    if (Array.isArray(response.result)) {
      buckets = response.result;
    } else {
      const bucketEnvelope = response.result as { readonly buckets?: ReadonlyArray<R2BucketRecord> };
      buckets = bucketEnvelope.buckets ?? [];
    }

    const bucket = buckets.find((entry) => entry.name === name);
    return bucket === undefined ? null : { bucketName: bucket.name };
  }
}
