export interface UpdateTenantBrandingCommand {
  readonly tenantId: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly logoUrl: string | null;
}

export const updateTenantBranding = async (
  command: UpdateTenantBrandingCommand
): Promise<{ readonly updated: boolean }> => {
  void command;
  return { updated: true };
};
