export interface TenantFeatureFlagInput {
  readonly key: string;
  readonly enabled: boolean;
}

export interface UpdateTenantFeatureFlagsCommand {
  readonly tenantId: string;
  readonly flags: ReadonlyArray<TenantFeatureFlagInput>;
}

export const updateTenantFeatureFlags = async (
  command: UpdateTenantFeatureFlagsCommand
): Promise<{ readonly updatedCount: number }> => {
  return { updatedCount: command.flags.length };
};
