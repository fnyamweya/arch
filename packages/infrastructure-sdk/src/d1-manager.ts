import type { CloudflareClient } from "./cloudflare-client";

export interface D1ProvisionResult {
  readonly databaseId: string;
}

interface D1DatabaseRecord {
  readonly uuid: string;
  readonly name: string;
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

  public async findDatabaseByName(name: string): Promise<D1ProvisionResult | null> {
    const response: {
      readonly result: ReadonlyArray<D1DatabaseRecord>;
    } = await this.client.request(`/accounts/${this.accountId}/d1/database`, {
      method: "GET"
    });

    const database = response.result.find((entry) => entry.name === name);
    return database === undefined ? null : { databaseId: database.uuid };
  }
}
