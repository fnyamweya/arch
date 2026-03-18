import { PageContainer } from "@arch/ui-kit";
import { getTenantAuthConfiguration } from "../../../../../lib/internal-platform-api";

interface TenantAuthSettingsPageProps {
    readonly params: Promise<{
        readonly tenantId: string;
    }>;
}

export default async function TenantAuthSettingsPage(props: TenantAuthSettingsPageProps) {
    const { tenantId } = await props.params;
    const config = await getTenantAuthConfiguration(tenantId);

    const summary = config === null
        ? []
        : [
            {
                label: "Scope",
                value: config.tenantScopedConfiguration ? "Tenant-specific" : "Platform-managed",
                helper: "Development uses one Better Auth platform configuration instead of per-tenant identity vendor keys.",
            },
            {
                label: "Credential strategies",
                value: config.credentialStrategies.join(", "),
                helper: "These strategies are exposed by the auth worker and consumed through same-origin /api/client-auth endpoints.",
            },
            {
                label: "Social providers",
                value: config.socialProviders.length > 0 ? config.socialProviders.join(", ") : "Not configured",
                helper: "Providers are enabled centrally from auth worker environment variables.",
            },
            {
                label: "Cookie domain",
                value: config.cookieDomain ?? "Host-only cookies",
                helper: "Cross-subdomain cookies remain optional and are controlled at the platform layer.",
            },
        ] as const;

    return (
        <PageContainer
            pageTitle="Auth Settings"
            pageDescription="Platform-managed Better Auth configuration for this tenant environment."
        >
            <div className="space-y-6">
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="space-y-2 border-b border-border pb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Identity platform</p>
                        <h2 className="text-xl font-semibold tracking-tight">Better Auth configuration</h2>
                        <p className="max-w-3xl text-sm text-muted-foreground">
                            Authentication is configured centrally in the auth worker and exposed to apps through same-origin server routes.
                        </p>
                    </div>

                    {config === null ? (
                        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                            Auth worker configuration is currently unavailable. Confirm AUTH_WORKER_INTERNAL_URL and the auth worker runtime are reachable.
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
                            <div className="space-y-4">
                                {summary.map((item) => (
                                    <div key={item.label} className="rounded-xl border bg-muted/30 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                                        <p className="mt-2 break-all font-mono text-xs leading-6 text-foreground">{item.value}</p>
                                        <p className="mt-2 text-xs text-muted-foreground">{item.helper}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl border bg-gradient-to-br from-card to-muted/30 p-6 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Runtime posture</p>
                                    <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                                        <p>Tenant-specific auth secrets are not required in development. Every app consumes the same Better Auth backend through /api/auth and /api/client-auth.</p>
                                        <p>Trusted origins: {config.trustedOrigins.join(", ")}.</p>
                                        <p>Phone OTP webhook: {config.phoneOtpWebhookConfigured ? "configured" : "not configured"}.</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Tenant</p>
                                    <p className="mt-3 text-sm text-muted-foreground">This tenant inherits platform auth settings.</p>
                                    <p className="mt-4 font-mono text-sm text-foreground">{tenantId}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}