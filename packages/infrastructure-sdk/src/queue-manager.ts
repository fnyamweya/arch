import type { CloudflareClient } from "./cloudflare-client";

export interface QueueProvisionResult {
  readonly queueName: string;
}

export class QueueManager {
  private readonly client: CloudflareClient;
  private readonly accountId: string;

  public constructor(client: CloudflareClient, accountId: string) {
    this.client = client;
    this.accountId = accountId;
  }

  public async createQueue(queueName: string): Promise<QueueProvisionResult> {
    await this.client.request(`/accounts/${this.accountId}/queues`, {
      method: "POST",
      body: JSON.stringify({ queue_name: queueName })
    });
    return { queueName };
  }
}
