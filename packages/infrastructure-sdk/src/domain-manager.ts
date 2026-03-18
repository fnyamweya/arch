import type { CloudflareClient } from "./cloudflare-client";

export interface WorkerDomainMappingInput {
  readonly hostname: string;
  readonly service: string;
  readonly environment?: string;
}

export class DomainManager {
  private readonly client: CloudflareClient;
  private readonly accountId: string;

  public constructor(client: CloudflareClient, accountId: string) {
    this.client = client;
    this.accountId = accountId;
  }

  public async mapWorkerDomain(input: WorkerDomainMappingInput): Promise<void> {
    const body: Record<string, string> = {
      hostname: input.hostname,
      service: input.service
    };

    if (input.environment !== undefined && input.environment.trim().length > 0) {
      body.environment = input.environment;
    }

    await this.client.request(`/accounts/${this.accountId}/workers/domains`, {
      method: "PUT",
      body: JSON.stringify(body)
    });
  }
}
