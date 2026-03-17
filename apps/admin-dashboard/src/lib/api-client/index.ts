export interface ApiClientConfig {
  readonly baseUrl: string;
}

export const createApiClient = (config: ApiClientConfig): ApiClientConfig => {
  return config;
};
