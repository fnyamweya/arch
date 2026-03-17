export interface TenantSentryConfig {
  readonly tenantId: string;
  readonly sentryDsn: string | null;
  readonly environment: string;
  readonly tracesSampleRate: number;
}

export const resolveSentryDsn = (
  tenantSentryDsn: string | null,
  platformSentryDsn: string
): string => {
  return tenantSentryDsn ?? platformSentryDsn;
};
