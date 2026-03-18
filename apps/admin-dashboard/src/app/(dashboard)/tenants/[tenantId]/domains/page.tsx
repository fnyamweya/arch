import { Button, Input, PageContainer } from "@arch/ui-kit";
import { getTenantDomains } from "../../../../../lib/internal-platform-api";
import { addTenantDomainAction, removeTenantDomainAction, setPrimaryTenantDomainAction } from "../actions";

interface TenantDomainsPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
  readonly searchParams: Promise<{
    readonly status?: string;
    readonly message?: string;
  }>;
}

export default async function TenantDomainsPage(props: TenantDomainsPageProps) {
  const { tenantId } = await props.params;
  const searchParams = await props.searchParams;
  const domainState = await getTenantDomains(tenantId);
  const domains = domainState?.domains ?? [];
  const isError = searchParams.status === "error";
  const noticeClassName = isError
    ? "border-destructive/40 bg-destructive/10 text-destructive"
    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  const overviewCards = [
    {
      label: "Primary domain",
      value: domainState?.primaryDomain ?? "Not configured",
      helper: "Default host returned during tenant resolution."
    },
    {
      label: "Configured domains",
      value: String(domains.length),
      helper: "Primary plus any additional mapped hosts."
    },
    {
      label: "Routing mode",
      value: domains.some((domain) => domain.isPrimary) ? "Tenant KV + D1 sync" : "Awaiting primary domain",
      helper: "Mappings are written to KV and refreshed from D1."
    }
  ] as const;

  return (
    <PageContainer pageTitle="Domains" pageDescription="Tenant custom domain management.">
      <div className="space-y-6">
        {typeof searchParams.message === "string" ? (
          <div className={`rounded-xl border px-4 py-3 text-sm ${noticeClassName}`}>
            {searchParams.message}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          {overviewCards.map((card) => (
            <div key={card.label} className="rounded-2xl border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
              <p className="mt-3 break-all font-mono text-sm leading-6 text-foreground">{card.value}</p>
              <p className="mt-3 text-xs text-muted-foreground">{card.helper}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 border-b border-border pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Provisioning</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Add tenant domain</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Register a production host, mark it primary when needed, and keep routing state consistent between KV and D1.
              </p>
            </div>

            <form action={addTenantDomainAction} className="space-y-5">
              <input type="hidden" name="tenantId" value={tenantId} />

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Domain</span>
                <Input name="domain" placeholder="store.example.com" required className="font-mono" />
              </label>

              <label className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
                <input
                  name="isPrimary"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-input bg-background text-primary"
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">Make this the primary domain</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Primary domains become the default host returned by tenant resolution and should represent the canonical login experience.
                  </span>
                </span>
              </label>

              <div className="flex justify-end border-t border-border pt-5">
                <Button type="submit">Save domain</Button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Routing table</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">Configured domains</h2>
                <p className="mt-2 text-sm text-muted-foreground">Promote, inspect, and remove tenant hosts without leaving the dashboard.</p>
              </div>
              <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                Tenant {tenantId}
              </div>
            </div>

            <div className="space-y-3">
              {domains.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                  No tenant domains configured yet.
                </div>
              ) : (
                domains.map((domain) => (
                  <div key={domain.id} className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="break-all font-mono text-sm font-medium text-foreground">{domain.domain}</p>
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${domain.isPrimary ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border bg-background text-muted-foreground"}`}>
                          {domain.isPrimary ? "Primary" : "Secondary"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {domain.isPrimary ? "Canonical tenant host used as the default resolution target." : "Additional mapped host available for storefront and auth traffic."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {!domain.isPrimary ? (
                        <form action={setPrimaryTenantDomainAction}>
                          <input type="hidden" name="tenantId" value={tenantId} />
                          <input type="hidden" name="domain" value={domain.domain} />
                          <Button type="submit" variant="outline">Make primary</Button>
                        </form>
                      ) : null}

                      <form action={removeTenantDomainAction}>
                        <input type="hidden" name="tenantId" value={tenantId} />
                        <input type="hidden" name="domain" value={domain.domain} />
                        <Button type="submit" variant="destructive" disabled={domain.isPrimary && domains.length === 1}>Remove</Button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
