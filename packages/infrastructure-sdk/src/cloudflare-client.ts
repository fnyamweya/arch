import type { CloudflareApiConfig } from "./types";

export class CloudflareClient {
  private readonly config: CloudflareApiConfig;

  public constructor(config: CloudflareApiConfig) {
    this.config = config;
  }

  public async request<T>(path: string, init?: RequestInit): Promise<T> {
    const requestInit: RequestInit = {
      ...init,
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    };
    const response: Response = await fetch(`${this.config.apiBaseUrl}${path}`, requestInit);
    if (!response.ok) {
      throw new Error(`Cloudflare API request failed with status ${response.status}`);
    }
    return (await response.json()) as T;
  }
}
