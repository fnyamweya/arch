export interface ConfigureTenantSentryCommand {
  readonly tenantId: string;
  readonly sentryDsn: string;
  readonly tracesSampleRate: number;
}

export const configureTenantSentry = async (
  command: ConfigureTenantSentryCommand
): Promise<{ readonly configured: boolean }> => {
  void command;
  return { configured: true };
};
