export interface RevokeTenantAccessCommand {
  readonly tenantId: string;
  readonly userId: string;
}

export const revokeTenantAccess = async (
  command: RevokeTenantAccessCommand
): Promise<{ readonly revoked: boolean }> => {
  void command;
  return { revoked: true };
};
