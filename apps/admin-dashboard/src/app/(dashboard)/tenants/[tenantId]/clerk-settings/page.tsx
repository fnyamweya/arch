import { Button, Input, PageContainer } from "@arch/ui-kit";
import { getTenantClerkConfig } from "../../../../../lib/internal-platform-api";
import { saveTenantClerkSettingsAction } from "../actions";

interface TenantClerkSettingsPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
  readonly searchParams: Promise<{
    readonly status?: string;
    readonly message?: string;
  }>;
}

export default async function TenantClerkSettingsPage(props: TenantClerkSettingsPageProps) {
  const { tenantId } = await props.params;
  const searchParams = await props.searchParams;
  const config = await getTenantClerkConfig(tenantId);
  const isError = searchParams.status === "error";
  const noticeClassName = isError
    ? "border-destructive/40 bg-destructive/10 text-destructive"
    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  const configurationSummary = [
    {
      label: "Publishable key",
      value: config?.publishableKey ?? "Not configured",
      helper: "Injected into ClerkProvider at render time."
    },
    {
      label: "Auth domain",
      value: config?.authDomain ?? "Not configured",
      helper: "Used for tenant-specific sign-in routing."
    },
    {
      label: "JWKS source",
      value: config?.jwksUrl ?? "Derived from auth domain when omitted",
      helper: "JWT verification endpoint consumed by the auth worker."
    }
  ] as const;

  return (
    <PageContainer pageTitle="Clerk Settings" pageDescription="Tenant authentication configuration.">
      <div className="space-y-6">
        {typeof searchParams.message === "string" ? (
          <div className={`rounded-xl border px-4 py-3 text-sm ${noticeClassName}`}>
            {searchParams.message}
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Identity</p>
                <h2 className="text-xl font-semibold tracking-tight">Clerk tenant configuration</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Publishable key changes apply to the resolved tenant at runtime. Leave secret fields blank to retain the encrypted values already stored in the auth worker.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Tenant {tenantId}
              </div>
            </div>

            <form action={saveTenantClerkSettingsAction} className="space-y-6">
              <input type="hidden" name="tenantId" value={tenantId} />

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Publishable key</span>
                  <Input
                    name="clerkPublishableKey"
                    defaultValue={config?.publishableKey ?? ""}
                    placeholder="pk_live_..."
                    required
                    className="font-mono"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Auth domain</span>
                  <Input
                    name="clerkAuthDomain"
                    defaultValue={config?.authDomain ?? ""}
                    placeholder="https://auth.example.com"
                    className="font-mono"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Proxy URL</span>
                  <Input
                    name="clerkProxyUrl"
                    defaultValue={config?.proxyUrl ?? ""}
                    placeholder="https://clerk.example.com"
                    className="font-mono"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">JWKS URL</span>
                  <Input
                    name="clerkJwksUrl"
                    defaultValue={config?.jwksUrl ?? ""}
                    placeholder="https://auth.example.com/.well-known/jwks.json"
                    className="font-mono"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Secret key</span>
                  <Input name="clerkSecretKey" type="password" placeholder="Leave blank to keep current value" className="font-mono" />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Webhook secret</span>
                  <Input name="clerkWebhookSecret" type="password" placeholder="Leave blank to keep current value" className="font-mono" />
                </label>
              </div>

              <div className="flex justify-end border-t border-border pt-6">
                <Button type="submit">Save Clerk settings</Button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-gradient-to-br from-card to-muted/30 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Guardrails</p>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <p>Use a tenant-specific auth domain when you want branded sign-in URLs and automatic JWKS derivation.</p>
                <p>Use an explicit JWKS URL only when the upstream auth edge does not expose the standard well-known endpoint.</p>
                <p>Secret fields are write-only by design. Submitting empty values preserves the encrypted secrets already stored.</p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Runtime snapshot</p>
              <div className="space-y-3">
                {configurationSummary.map((item) => (
                  <div key={item.label} className="rounded-xl border bg-muted/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 break-all font-mono text-xs leading-6 text-foreground">{item.value}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{item.helper}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
