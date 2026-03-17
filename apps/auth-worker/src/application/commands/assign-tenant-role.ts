export interface AssignTenantRoleCommand {
  readonly tenantId: string;
  readonly userId: string;
  readonly role: string;
}

export const assignTenantRole = async (
  command: AssignTenantRoleCommand
): Promise<{ readonly assigned: boolean }> => {
  void command;
  return { assigned: true };
};
