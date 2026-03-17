import type { CloudflareClient } from "./cloudflare-client";

export interface WorkerDomainMappingInput {
  readonly hostname: string;
  readonly service: string;
  readonly environment: string;
}

export class DomainManager {
  private readonly client: CloudflareClient;
  private readonly accountId: string;

  public constructor(client: CloudflareClient, accountId: string) {
    this.client = client;
    this.accountId = accountId;
  }

  public async mapWorkerDomain(input: WorkerDomainMappingInput): Promise<void> {
    await this.client.request(`/accounts/${this.accountId}/workers/domains`, {
      method: "PUT",
      body: JSON.stringify({
        hostname: input.hostname,
        service: input.service,
        environment: input.environment
      })
    });
  }
}
