import type { CloudflareClient } from "./cloudflare-client";

export interface D1ProvisionResult {
  readonly databaseId: string;
}

export class D1Manager {
  private readonly client: CloudflareClient;
  private readonly accountId: string;

  public constructor(client: CloudflareClient, accountId: string) {
    this.client = client;
    this.accountId = accountId;
  }

  public async createDatabase(name: string): Promise<D1ProvisionResult> {
    const response: {
      readonly result: {
        readonly uuid: string;
      };
    } = await this.client.request(`/accounts/${this.accountId}/d1/database`, {
      method: "POST",
      body: JSON.stringify({ name })
    });
    return { databaseId: response.result.uuid };
  }
}
