export interface SuspendTenantCommand {
  readonly tenantId: string;
  readonly reason: string;
}

export const suspendTenant = async (
  command: SuspendTenantCommand
): Promise<{ readonly suspended: boolean }> => {
  void command;
  return { suspended: true };
};
