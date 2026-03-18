import type { CloudflareApiConfig } from "./types";

export class CloudflareApiError extends Error {
  public readonly status: number;
  public readonly responseBody: string;

  public constructor(status: number, responseBody: string) {
    super(`Cloudflare API request failed with status ${status}${responseBody.length > 0 ? `: ${responseBody}` : ""}`);
    this.name = "CloudflareApiError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

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
      throw new CloudflareApiError(response.status, await response.text());
    }
    return (await response.json()) as T;
  }
}
