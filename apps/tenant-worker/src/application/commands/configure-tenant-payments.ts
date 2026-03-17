export interface ConfigureTenantPaymentsCommand {
  readonly tenantId: string;
  readonly defaultCurrency: string;
  readonly taxCalculationMode: "inclusive" | "exclusive" | "none";
}

export const configureTenantPayments = async (
  command: ConfigureTenantPaymentsCommand
): Promise<{ readonly configured: boolean }> => {
  void command;
  return { configured: true };
};
