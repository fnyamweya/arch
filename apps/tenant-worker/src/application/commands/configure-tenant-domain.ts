export interface ConfigureTenantDomainCommand {
  readonly tenantId: string;
  readonly domain: string;
  readonly isPrimary: boolean;
}

export const configureTenantDomain = async (
  command: ConfigureTenantDomainCommand
): Promise<{ readonly mapped: boolean }> => {
  void command;
  return { mapped: true };
};
