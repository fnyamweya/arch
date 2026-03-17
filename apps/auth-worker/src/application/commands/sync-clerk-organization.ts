export interface SyncClerkOrganizationCommand {
  readonly clerkOrganizationId: string;
  readonly tenantId: string;
}

export const syncClerkOrganization = async (
  command: SyncClerkOrganizationCommand
): Promise<{ readonly synced: boolean }> => {
  void command;
  return { synced: true };
};
