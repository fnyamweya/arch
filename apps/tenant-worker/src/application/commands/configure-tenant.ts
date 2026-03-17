export interface ConfigureTenantCommand {
  readonly tenantId: string;
  readonly displayName: string;
  readonly primaryDomain: string;
}

export const configureTenant = async (
  command: ConfigureTenantCommand
): Promise<{ readonly configured: boolean }> => {
  void command;
  return { configured: true };
};
