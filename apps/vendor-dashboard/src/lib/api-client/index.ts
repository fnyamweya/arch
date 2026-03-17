export interface VendorApiClientConfig {
  readonly baseUrl: string;
}

export const createVendorApiClient = (config: VendorApiClientConfig): VendorApiClientConfig => {
  return config;
};
