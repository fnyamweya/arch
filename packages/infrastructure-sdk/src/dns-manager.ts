import type { CloudflareClient } from "./cloudflare-client";

export interface DnsRecordInput {
  readonly zoneId: string;
  readonly name: string;
  readonly type: "A" | "AAAA" | "CNAME" | "TXT";
  readonly content: string;
  readonly proxied: boolean;
}

export class DnsManager {
  private readonly client: CloudflareClient;
  private readonly accountId: string;

  public constructor(client: CloudflareClient, accountId: string) {
    this.client = client;
    this.accountId = accountId;
  }

  public async createDnsRecord(input: DnsRecordInput): Promise<void> {
    await this.client.request(`/zones/${input.zoneId}/dns_records`, {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        type: input.type,
        content: input.content,
        proxied: input.proxied
      })
    });
  }

  public getAccountId(): string {
    return this.accountId;
  }
}
