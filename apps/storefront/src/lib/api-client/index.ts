export interface StorefrontApiClientConfig {
  readonly baseUrl: string;
}

export const createStorefrontApiClient = (
  config: StorefrontApiClientConfig
): StorefrontApiClientConfig => {
  return config;
};
