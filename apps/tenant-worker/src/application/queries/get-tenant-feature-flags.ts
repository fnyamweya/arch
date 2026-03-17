export interface TenantFeatureFlagView {
  readonly key: string;
  readonly enabled: boolean;
}

export const getTenantFeatureFlags = async (
  tenantId: string
): Promise<ReadonlyArray<TenantFeatureFlagView>> => {
  void tenantId;
  return [];
};
