import type {
    DashboardFormPageTemplateProps,
    DashboardOverviewTemplateProps,
    DashboardTablePageTemplateProps,
} from "@arch/ui-kit";

const overviewTabs = [
    { label: "Command view", active: true },
    { label: "Experiments", disabled: true },
] as const;

const workspaceTabs = [
    { label: "Overview", active: true },
    { label: "Comparisons", disabled: true },
] as const;

const formTabs = [
    { label: "Configuration", active: true },
    { label: "Approvals", disabled: true },
] as const;

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;
const sprintLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;

const metric = (
    label: string,
    value: string,
    delta: string,
    trend: "up" | "down" | "neutral",
    headline: string,
    detail: string
) => ({
    label,
    value,
    delta,
    trend,
    headline,
    detail,
});

const row = (
    primary: string,
    meta: string,
    secondary: string,
    tertiary: string,
    status: string,
    tone: "positive" | "warning" | "neutral" = "neutral"
) => ({
    primary,
    meta,
    secondary,
    tertiary,
    status,
    tone,
});

const insight = (
    label: string,
    value: string,
    hint: string,
    tone: "positive" | "warning" | "neutral" = "neutral"
) => ({
    label,
    value,
    hint,
    tone,
});

const sharedBar = {
    labels: sprintLabels,
    series: [
        { label: "Interactive load", total: "412k", points: [48, 52, 61, 74, 69, 77, 81, 86] },
        { label: "Background jobs", total: "196k", points: [22, 28, 31, 34, 30, 36, 41, 45] },
    ],
} as const;

const sharedArea = {
    labels: monthLabels,
    series: [
        { label: "Interactive", points: [180, 245, 232, 278, 296, 320] },
        { label: "Scheduled", points: [92, 118, 126, 148, 161, 179] },
    ],
} as const;

const sharedDonut = {
    totalLabel: "weekly flows",
    slices: [
        { label: "Identity", value: 34 },
        { label: "Commerce", value: 26 },
        { label: "Ledger", value: 22 },
        { label: "Support", value: 18 },
    ],
} as const;

export const adminOverviewPage = {
    greeting: "Platform pulse for the operating team",
    actionLabel: "Export snapshot",
    tabs: overviewTabs,
    metrics: [
        metric("Live workspaces", "184", "+8.2%", "up", "Pipeline velocity improved", "New launches over the last two sprints"),
        metric("Secure sign-ins", "99.98%", "+0.4%", "up", "Authentication edge remains stable", "Global availability across branded domains"),
        metric("Ledger batches", "12.4k", "+6.1%", "up", "Settlement jobs cleared faster", "Background accounting flows in the last 14 days"),
        metric("Gross throughput", "$8.7M", "+3.9%", "up", "Healthy transaction expansion", "Net platform movement this month"),
    ],
    barChart: {
        title: "Control plane volume",
        description: "Interactive traffic compared with scheduled jobs over the last eight checkpoints.",
        ...sharedBar,
    },
    areaChart: {
        title: "Resilience profile",
        description: "Operational demand split between customer-facing and scheduled workloads.",
        ...sharedArea,
        footerTitle: "Background automation absorbs most variance",
        footerNote: "Six-month trend across identity, routing, and ledger orchestration.",
    },
    donutChart: {
        title: "Operational mix",
        description: "Share of platform activity by major product surface.",
        ...sharedDonut,
        footerTitle: "Identity continues to lead system interactions",
        footerNote: "Weighted from the most recent weekly processing window.",
    },
    activity: {
        title: "Recent interventions",
        description: "High-signal changes routed through the admin team this week.",
        items: [
            { title: "Northstar launch", subtitle: "Branded auth domain promoted", value: "Ready", initials: "NL" },
            { title: "Ledger replay", subtitle: "Backfilled settlement queue", value: "2.3k jobs", initials: "LR" },
            { title: "Risk review", subtitle: "Elevated checkout fraud screened", value: "14 flags", initials: "RR" },
            { title: "Tenant migration", subtitle: "Storefront theme synchronized", value: "4 regions", initials: "TM" },
        ],
    },
} satisfies DashboardOverviewTemplateProps;

export const adminAnalyticsPage = {
    pageTitle: "Analytics",
    pageDescription: "Demand, adoption, and operational patterns across the platform.",
    tabs: workspaceTabs,
    metrics: [
        metric("Routing sessions", "1.24M", "+9.4%", "up", "Session volume keeps expanding", "Rolling 30-day tenant traffic"),
        metric("Activation lag", "18h", "-7.0%", "down", "Launch time is shrinking", "Median time from create to live"),
        metric("Upgrade intent", "42%", "+3.1%", "up", "Expansion interest is holding", "Commercial signals from managed accounts"),
        metric("Support deflection", "68%", "+2.2%", "up", "Automation reduced escalations", "Self-service completion across admin tools"),
    ],
    table: {
        title: "Signal board",
        description: "Cross-functional observations the admin team is following closely this cycle.",
        columns: ["Signal", "Window", "Variance", "State"],
        rows: [
            row("New tenant launches", "Provisioning and onboarding readiness", "7-day rolling", "+11.2%", "Healthy", "positive"),
            row("Custom domain adoption", "Branded auth and storefront routing", "30-day rolling", "+6.4%", "Healthy", "positive"),
            row("Clerk key rotation", "Credential refresh coverage", "Current sprint", "94% complete", "Watching", "warning"),
            row("Finance reconciliation", "Matched vs pending entries", "Month to date", "98.6% matched", "Healthy", "positive"),
        ],
        footer: "Signals update nightly and prioritize surfaces with tenant-facing or financial impact.",
    },
    insights: {
        title: "Watchlist",
        description: "Items that merit explicit operator attention before the next release window.",
        items: [
            insight("Onboarding bottleneck", "2 queues", "Manual DNS review is the main remaining delay.", "warning"),
            insight("Auth edge saturation", "Low", "Peak request density remains well below alert thresholds.", "positive"),
            insight("Ledger drift", "0.7%", "Variance is isolated to delayed provider settlements.", "neutral"),
        ],
    },
    barChart: {
        title: "Operator demand",
        description: "Interactive review work against scheduled automation throughput.",
        ...sharedBar,
    },
    donutChart: {
        title: "Traffic allocation",
        description: "How the platform's most visible workloads are currently distributed.",
        ...sharedDonut,
        footerTitle: "Commerce and identity remain the primary workload drivers",
        footerNote: "Distribution based on the latest reconciled reporting interval.",
    },
} satisfies DashboardTablePageTemplateProps;

export const adminLedgerPage = {
    pageTitle: "Ledger",
    pageDescription: "Financial control coverage, exception management, and throughput health.",
    tabs: workspaceTabs,
    metrics: [
        metric("Posting accuracy", "99.6%", "+0.3%", "up", "Mismatch rate remains controlled", "Validated across the latest batch cycle"),
        metric("Pending journals", "183", "-12.8%", "down", "Review backlog is dropping", "Open entries waiting for finance approval"),
        metric("Settlement delay", "4.2h", "-9.1%", "down", "Provider latency improved", "Median delay before final settlement"),
        metric("Exceptions handled", "328", "+5.7%", "up", "Automation resolved more edge cases", "Cleared by policy or operator action"),
    ],
    table: {
        title: "Ledger health board",
        description: "Core ledger surfaces ranked by current operating quality and exception risk.",
        columns: ["Surface", "Window", "Variance", "State"],
        rows: [
            row("Settlement posting", "Provider payout settlement ingestion", "Last 24 hours", "99.8% success", "Healthy", "positive"),
            row("Refund reversal flow", "Chargebacks and partial returns", "Last 7 days", "1.4% rework", "Watching", "warning"),
            row("Currency normalization", "Cross-border conversions", "Month to date", "0.2% drift", "Healthy", "positive"),
            row("Manual adjustments", "Operator-issued correction entries", "Current sprint", "43 actions", "Stable", "neutral"),
        ],
        footer: "Use this board to spot posting anomalies before they impact tenant statements or reconciliation windows.",
    },
    insights: {
        title: "Finance notes",
        description: "Signals from the accounting workflow that explain the current ledger posture.",
        items: [
            insight("Provider lag", "Contained", "The majority of delay remains isolated to two banking partners.", "neutral"),
            insight("Manual reviews", "19 open", "High-value adjustments are still operator-owned.", "warning"),
            insight("Reserve coverage", "On track", "Protected balances remain within policy targets.", "positive"),
        ],
    },
    barChart: {
        title: "Posting cadence",
        description: "Interactive approvals versus automated ledger activity.",
        ...sharedBar,
    },
    donutChart: {
        title: "Balance movement",
        description: "Primary sources driving ledger change across the current cycle.",
        totalLabel: "ledger flows",
        slices: [
            { label: "Orders", value: 38 },
            { label: "Refunds", value: 21 },
            { label: "Payouts", value: 27 },
            { label: "Adjustments", value: 14 },
        ],
        footerTitle: "Order capture still contributes the largest balance movement",
        footerNote: "Mix based on current month-to-date journal activity.",
    },
} satisfies DashboardTablePageTemplateProps;

export const adminLedgerAccountsPage = {
    pageTitle: "Ledger Accounts",
    pageDescription: "Account exposure, balance confidence, and reserve posture.",
    tabs: workspaceTabs,
    metrics: [
        metric("Open accounts", "246", "+1.6%", "up", "New segments are being added carefully", "Includes control, reserve, and clearing accounts"),
        metric("Reconciled balance", "$24.1M", "+2.8%", "up", "Cash position continues to expand", "Combined cleared and reserve balances"),
        metric("Dormant accounts", "12", "-14.3%", "down", "Unused accounts are being retired", "Accounts without movement over two cycles"),
        metric("Reserve utilization", "71%", "+2.1%", "up", "Risk buffers remain intentionally funded", "Protection coverage for contested flows"),
    ],
    table: {
        title: "Account registry",
        description: "Balance-bearing accounts with the most material movement or operator attention.",
        columns: ["Account", "Owner", "Balance shift", "State"],
        rows: [
            row("Marketplace clearing", "Primary order clearing ledger", "Treasury", "+$1.3M", "Healthy", "positive"),
            row("Refund reserve", "Refund and dispute protection buffer", "Risk", "+$184k", "Stable", "neutral"),
            row("Payout suspense", "Awaiting provider confirmation", "Finance ops", "-$63k", "Watching", "warning"),
            row("FX adjustment", "Cross-currency balancing account", "Treasury", "+$22k", "Healthy", "positive"),
        ],
        footer: "High-movement accounts are monitored first because they have the greatest downstream tenant reporting impact.",
    },
    insights: {
        title: "Account notes",
        description: "Why specific accounts are elevated in the review queue.",
        items: [
            insight("Clearing balance", "Expected", "The growth tracks seasonal order volume.", "positive"),
            insight("Reserve drawdown", "Low", "No unusual contest activity detected.", "positive"),
            insight("Suspense aging", "3 cases", "A small set of provider callbacks are still pending.", "warning"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const adminLedgerJournalEntriesPage = {
    pageTitle: "Journal Entries",
    pageDescription: "Posting review, sequencing quality, and exception routing for accounting operations.",
    tabs: workspaceTabs,
    metrics: [
        metric("Daily entries", "8,412", "+4.8%", "up", "Posting volume continues to rise", "Created across automated and manual workflows"),
        metric("Review queue", "57", "-18.6%", "down", "Manual approvals were cleared faster", "Entries still waiting for sign-off"),
        metric("Replay events", "21", "-6.2%", "down", "Fewer retries were needed", "Duplicate-safe replays after provider lag"),
        metric("Average sequence gap", "0.03%", "-0.9%", "down", "Sequencing remains clean", "Entries flagged for ordering anomalies"),
    ],
    table: {
        title: "Journal queue",
        description: "Entry cohorts most likely to affect close timing or downstream reporting quality.",
        columns: ["Cohort", "Owner", "Variance", "State"],
        rows: [
            row("Daily captures", "Standard order and refund postings", "Automation", "Within tolerance", "Healthy", "positive"),
            row("Manual corrections", "Operator-authored balancing entries", "Finance ops", "11 awaiting sign-off", "Watching", "warning"),
            row("Provider retries", "Replay-safe ledger regeneration", "Platform jobs", "0.4% of flow", "Stable", "neutral"),
            row("Foreign exchange", "Cross-market settlement adjustments", "Treasury", "Minor rounding drift", "Healthy", "positive"),
        ],
        footer: "Use this view to keep close processes predictable and identify which entry families need human attention.",
    },
    insights: {
        title: "Posting context",
        description: "Signals that explain the current journal workload.",
        items: [
            insight("Manual edits", "Declining", "Automation absorbed most correction demand this sprint.", "positive"),
            insight("Replay safety", "Strong", "Duplicate protection remained intact across all provider retries.", "positive"),
            insight("Close readiness", "Good", "No entry cohort currently threatens close timing.", "neutral"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const adminLedgerReconciliationPage = {
    pageTitle: "Reconciliation",
    pageDescription: "Match quality across providers, payout rails, and internal accounting records.",
    tabs: workspaceTabs,
    metrics: [
        metric("Match rate", "98.9%", "+0.5%", "up", "Reconciliation confidence improved", "Matched across recent provider statements"),
        metric("Exceptions open", "34", "-22.7%", "down", "Exception queue is shrinking", "Unmatched or incomplete statement lines"),
        metric("Aging window", "2.6 days", "-11.3%", "down", "Open issues are being resolved faster", "Average exception age"),
        metric("Provider groups", "9", "0%", "neutral", "Coverage remains stable", "Integrated payout and banking partners"),
    ],
    table: {
        title: "Reconciliation board",
        description: "Statement groups with notable variance, aging, or follow-up burden.",
        columns: ["Source", "Owner", "Variance", "State"],
        rows: [
            row("Primary card processor", "Order capture and settlement files", "Finance", "99.4% matched", "Healthy", "positive"),
            row("EU bank rail", "Cross-border payout settlements", "Treasury", "7 unmatched lines", "Watching", "warning"),
            row("Wallet payouts", "Vendor remittance exports", "Operations", "Within tolerance", "Stable", "neutral"),
            row("Reserve transfers", "Internal treasury movement", "Treasury", "100% matched", "Healthy", "positive"),
        ],
        footer: "Exception reduction matters most where provider or treasury delays can block tenant settlement statements.",
    },
    insights: {
        title: "Exception notes",
        description: "Where reconciliation work is currently concentrated.",
        items: [
            insight("Card processor", "Green", "No material variance beyond standard timing differences.", "positive"),
            insight("EU rail latency", "7 lines", "Pending confirmation from the settlement partner.", "warning"),
            insight("Reserve movements", "Clear", "All internal transfers matched without operator correction.", "positive"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const adminLedgerReportsPage = {
    pageTitle: "Reports",
    pageDescription: "Scheduled reporting coverage for executives, finance, and tenant-facing stakeholders.",
    tabs: workspaceTabs,
    metrics: [
        metric("Scheduled reports", "37", "+5.7%", "up", "More reporting packs were automated", "Recurring internal and tenant-facing deliveries"),
        metric("On-time delivery", "99.1%", "+0.8%", "up", "Report generation stayed reliable", "Completed inside the expected send window"),
        metric("Manual exports", "18", "-9.5%", "down", "Ad hoc exports are declining", "One-off downloads requested by operators"),
        metric("Subscriber groups", "64", "+3.2%", "up", "More teams consume structured reporting", "Internal and tenant distribution cohorts"),
    ],
    table: {
        title: "Reporting catalogue",
        description: "The reports most relevant to executive visibility and tenant accountability.",
        columns: ["Report", "Audience", "Variance", "State"],
        rows: [
            row("Executive weekly pulse", "Leadership and ops directors", "Internal", "On schedule", "Healthy", "positive"),
            row("Tenant settlement digest", "Managed tenants", "External", "1 delayed issue", "Watching", "warning"),
            row("Reserve coverage summary", "Risk and finance", "Internal", "On schedule", "Healthy", "positive"),
            row("Reconciliation exception list", "Finance operations", "Internal", "Updated hourly", "Stable", "neutral"),
        ],
        footer: "Delivery health matters most for reports that directly affect tenant trust or executive planning.",
    },
    insights: {
        title: "Delivery notes",
        description: "Current reporting workflow posture at a glance.",
        items: [
            insight("Automation coverage", "High", "Most recurring reports no longer require manual triggering.", "positive"),
            insight("Tenant digest lag", "1 issue", "A delayed provider file held one scheduled digest.", "warning"),
            insight("Executive cadence", "Strong", "Leadership reports have remained consistently on time.", "positive"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const adminSettingsPage = {
    pageTitle: "Settings",
    pageDescription: "Operational defaults that shape workspace provisioning, routing, and audit behavior.",
    tabs: formTabs,
    metrics: [
        metric("Default auth domains", "24", "+1", "up", "Regional coverage expanded", "Preconfigured domain options available to new tenants"),
        metric("Audit retention", "180d", "0%", "neutral", "Retention target is unchanged", "Applies to security and operator audit events"),
        metric("Webhook uptime", "99.99%", "+0.1%", "up", "Inbound integrations remained stable", "Across tenant and platform event handlers"),
        metric("Guardrails enabled", "17", "+2", "up", "More defaults ship with strict policies", "Applies across creation and editing flows"),
    ],
    form: {
        title: "Platform defaults",
        description: "Shape how new workspaces are provisioned and what guardrails operators inherit by default.",
        sections: [
            {
                title: "Tenant bootstrap",
                description: "Baseline naming, routing, and operational metadata applied at create time.",
                fields: [
                    { label: "Default region set", placeholder: "us-east, eu-west" },
                    { label: "Provisioning SLA", placeholder: "4 hours", helper: "Used in internal runbooks and operator expectations." },
                    { label: "Workspace name pattern", placeholder: "team-slug", helper: "Human-friendly identifier used in dashboards and exports." },
                    { label: "Fallback domain", placeholder: "platform.example.com", type: "url" },
                ],
            },
            {
                title: "Security posture",
                description: "Defaults that influence how auth and webhooks are initialized.",
                fields: [
                    { label: "Session duration", placeholder: "12 hours" },
                    { label: "Webhook verification policy", placeholder: "Required for all tenants" },
                    { label: "Security escalation notes", placeholder: "Document responder expectations", kind: "textarea" },
                ],
            },
        ],
        submitLabel: "Save defaults",
    },
    notes: {
        title: "Operational notes",
        description: "Current admin-team context around the default platform posture.",
        items: [
            insight("Regional expansion", "Active", "New managed workspaces are increasingly launched across two regions.", "positive"),
            insight("Fallback domain review", "Pending", "A branded auth fallback is still under design review.", "warning"),
            insight("Audit coverage", "Strong", "Retention policies already satisfy the current compliance baseline.", "positive"),
        ],
    },
    checklist: {
        title: "Release checklist",
        description: "High-signal items the team validates before changing global defaults.",
        items: [
            insight("Rollback path documented", "Required", "Defaults should be reversible without tenant downtime.", "neutral"),
            insight("Auth migration tested", "Required", "Validate tenant-specific Clerk overrides before rollout.", "neutral"),
            insight("Audit event coverage verified", "Required", "Every change should emit an attributable operator event.", "neutral"),
        ],
    },
} satisfies DashboardFormPageTemplateProps;

export const adminTenantsPage = {
    pageTitle: "Tenants",
    pageDescription: "Managed workspaces, rollout posture, and operator-owned launch readiness.",
    actionLabel: "Create tenant",
    actionHref: "/tenants/create",
    tabs: workspaceTabs,
    metrics: [
        metric("Managed tenants", "184", "+8.2%", "up", "New workspace count is trending upward", "Includes staging and production workspaces"),
        metric("Branded domains", "129", "+6.7%", "up", "Custom routing adoption continues to rise", "Active tenant-owned production hosts"),
        metric("Provisioning backlog", "9", "-18.1%", "down", "Launch queue is getting smaller", "Workspaces awaiting manual platform steps"),
        metric("Feature parity", "93%", "+1.4%", "up", "Most tenants are on the latest capabilities", "Compared with the default control-plane baseline"),
    ],
    table: {
        title: "Tenant roster",
        description: "Workspaces currently under direct admin-team operational ownership.",
        columns: ["Tenant", "Stage", "Variance", "State"],
        rows: [
            row("Northstar", "Managed enterprise workspace", "Production", "Ahead of launch plan", "Healthy", "positive"),
            row("Harbor Goods", "Mid-market migration in flight", "Staging", "2 unresolved tasks", "Watching", "warning"),
            row("Atlas Home", "Recently promoted storefront", "Production", "Within baseline", "Stable", "neutral"),
            row("Velvet Supply", "Security review completed", "Production", "Ready for expansion", "Healthy", "positive"),
        ],
        footer: "The roster emphasizes workspaces where the admin team still owns routing, auth, or financial configuration.",
    },
    insights: {
        title: "Launch notes",
        description: "Which tenants need the next operator action and why.",
        items: [
            insight("DNS coordination", "2 launches", "Two managed tenants still depend on external registrar updates.", "warning"),
            insight("Auth readiness", "Strong", "Most managed workspaces now have tenant-specific Clerk configuration.", "positive"),
            insight("Finance setup", "1 review", "A single tenant is waiting on reserve policy sign-off.", "neutral"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const adminCreateTenantPage = {
    pageTitle: "Create Tenant",
    pageDescription: "Prepare a new workspace with routing, security, and operational ownership from day one.",
    tabs: formTabs,
    metrics: [
        metric("Average launch time", "3.8 days", "-8.5%", "down", "Time to first live domain improved", "Measured from request intake to production host"),
        metric("Baseline modules", "11", "+2", "up", "More defaults now ship automatically", "Operational capabilities applied at workspace creation"),
        metric("Auth readiness", "96%", "+1.1%", "up", "New workspaces usually launch with branded auth", "Tenant-specific Clerk setup before go-live"),
        metric("Manual steps", "4", "-20%", "down", "Provisioning burden is shrinking", "Average human approvals required per launch"),
    ],
    form: {
        title: "Tenant launch brief",
        description: "Capture the details operators need to provision the new workspace accurately the first time.",
        sections: [
            {
                title: "Workspace profile",
                description: "High-level identity and operational ownership details.",
                fields: [
                    { label: "Tenant name", placeholder: "Northwind Commerce" },
                    { label: "Workspace slug", placeholder: "northwind" },
                    { label: "Primary operator", placeholder: "ops@company.com", type: "email" },
                    { label: "Escalation notes", placeholder: "Describe rollout constraints or launch dependencies", kind: "textarea" },
                ],
            },
            {
                title: "Routing and security",
                description: "Initial domain and authentication requirements for launch.",
                fields: [
                    { label: "Primary domain", placeholder: "shop.example.com", type: "url" },
                    { label: "Auth domain", placeholder: "auth.example.com", type: "url" },
                    { label: "Default region", placeholder: "us-east" },
                    { label: "Compliance flags", placeholder: "PCI, regional hosting, SSO" },
                ],
            },
        ],
        submitLabel: "Prepare launch",
    },
    notes: {
        title: "Operator guidance",
        description: "Signals that usually determine whether a new tenant launch stays on schedule.",
        items: [
            insight("Domain ownership", "Critical", "Registrar access is the most common blocker during launch.", "warning"),
            insight("Brand consistency", "Important", "Branded auth is now expected on almost every managed rollout.", "neutral"),
            insight("Escalation mapping", "Required", "Every tenant should have a named on-call partner before go-live.", "positive"),
        ],
    },
    checklist: {
        title: "Readiness checklist",
        description: "Minimum quality bar before the workspace can move into active provisioning.",
        items: [
            insight("Primary domain confirmed", "Needed", "A verified canonical host prevents routing drift later.", "neutral"),
            insight("Auth requirements captured", "Needed", "Document SSO, custom domain, and webhook expectations.", "neutral"),
            insight("Financial ownership named", "Needed", "Treasury or finance approval prevents settlement delays.", "neutral"),
        ],
    },
} satisfies DashboardFormPageTemplateProps;

export const adminUsersPage = {
    pageTitle: "Users",
    pageDescription: "Internal operators, responsibility coverage, and role distribution across the platform team.",
    tabs: workspaceTabs,
    metrics: [
        metric("Operators", "67", "+4.7%", "up", "More teams are using the control plane daily", "Staff with regular admin-dashboard access"),
        metric("Privileged roles", "18", "+1", "up", "Privileged access expanded slightly", "Users with elevated finance or security permissions"),
        metric("Stale access", "5", "-37.5%", "down", "Access cleanup is improving", "Users without recent sign-in activity"),
        metric("Coverage overlap", "81%", "+2.3%", "up", "More teams now have backup operators", "Shared ownership across critical workflows"),
    ],
    table: {
        title: "Operator roster",
        description: "Users with meaningful impact on routing, finance, or tenant operations.",
        columns: ["Operator", "Role", "Activity", "State"],
        rows: [
            row("Ari Stone", "Control-plane release owner", "Platform ops", "Active this week", "Healthy", "positive"),
            row("Jules Martin", "Tenant onboarding specialist", "Launch ops", "Pending role review", "Watching", "warning"),
            row("Remy Chen", "Ledger exception reviewer", "Finance ops", "Active today", "Stable", "neutral"),
            row("Nia Lewis", "Identity escalation manager", "Security", "Active this week", "Healthy", "positive"),
        ],
        footer: "Role and activity signals help identify both over-concentrated permissions and stale operational access.",
    },
    insights: {
        title: "Access posture",
        description: "Current staffing and permission hygiene themes across the operator base.",
        items: [
            insight("Privilege reviews", "Upcoming", "Quarterly access certification opens next week.", "warning"),
            insight("Backup coverage", "Improving", "Critical finance workflows now have named secondary owners.", "positive"),
            insight("Dormant accounts", "5", "A few low-activity accounts still need confirmation or removal.", "neutral"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export function createTenantDetailPage(tenantId: string): DashboardTablePageTemplateProps {
    return {
        pageTitle: `Tenant ${tenantId}`,
        pageDescription: "Workspace posture, launch quality, and operational status for this managed tenant.",
        tabs: workspaceTabs,
        metrics: [
            metric("Environment status", "Operational", "+1", "up", "No active incidents", "Routing, auth, and storefront services are green"),
            metric("Primary domain", "Live", "0%", "neutral", "Canonical tenant host is active", "Used for storefront and branded sign-in"),
            metric("Pending actions", "3", "-1", "down", "Operator queue is manageable", "Follow-up items still waiting on completion"),
            metric("Feature coverage", "91%", "+4%", "up", "Tenant is close to baseline parity", "Compared with the current managed default"),
        ],
        table: {
            title: "Workspace checkpoints",
            description: `Key operating checkpoints for ${tenantId} across routing, auth, and finance.`,
            columns: ["Checkpoint", "Owner", "Variance", "State"],
            rows: [
                row("Routing health", "Canonical and secondary hosts", "Platform", "No drift detected", "Healthy", "positive"),
                row("Identity setup", "Clerk configuration and webhook trust", "Security", "1 follow-up item", "Watching", "warning"),
                row("Settlement readiness", "Ledger and payout configuration", "Finance", "Within baseline", "Stable", "neutral"),
                row("Feature rollout", "Current managed capability set", "Platform", "Near baseline parity", "Healthy", "positive"),
            ],
            footer: "This view is optimized for operator handoffs, launch readiness, and tenant-specific follow-up work.",
        },
        insights: {
            title: "Tenant notes",
            description: "Signals that explain the tenant's current status and next operator action.",
            items: [
                insight("Domain posture", "Ready", "The primary production host is already routing correctly.", "positive"),
                insight("Identity follow-up", "1 item", "Tenant-specific secrets should be rotated after launch.", "warning"),
                insight("Financial readiness", "Good", "Settlement and reserve defaults are already in policy range.", "positive"),
            ],
        },
    };
}

export function createTenantBillingPage(tenantId: string): DashboardTablePageTemplateProps {
    return {
        pageTitle: "Billing",
        pageDescription: `Commercial posture, settlement readiness, and invoice health for ${tenantId}.`,
        tabs: workspaceTabs,
        metrics: [
            metric("Billing plan", "Enterprise", "0%", "neutral", "Commercial tier is unchanged", "Current managed billing agreement"),
            metric("Invoice health", "Current", "+1", "up", "No collection risk detected", "Billing state across the latest cycle"),
            metric("Reserve target", "Met", "+2%", "up", "Required buffers remain funded", "Coverage for contested or delayed flows"),
            metric("Payout readiness", "94%", "+3%", "up", "Most settlement prerequisites are complete", "Operational readiness before remittance"),
        ],
        table: {
            title: "Billing checkpoints",
            description: "The commercial and finance signals most likely to affect this tenant's ongoing operation.",
            columns: ["Checkpoint", "Owner", "Variance", "State"],
            rows: [
                row("Invoice cadence", "Recurring contract billing", "Finance", "On schedule", "Healthy", "positive"),
                row("Reserve coverage", "Protection for contested payouts", "Treasury", "Within target", "Healthy", "positive"),
                row("Payout approval", "Vendor remittance readiness", "Finance ops", "Needs review", "Watching", "warning"),
                row("Commercial amendments", "Pending contract changes", "Revenue ops", "No active changes", "Stable", "neutral"),
            ],
            footer: "Billing posture is kept separate from product rollout because it directly shapes settlement timing and commercial risk.",
        },
        insights: {
            title: "Commercial notes",
            description: "Short-form operator guidance for this tenant's financial relationship.",
            items: [
                insight("Collections risk", "Low", "No missed invoices or escalation patterns are present.", "positive"),
                insight("Reserve policy", "Healthy", "Current transaction profile remains inside funded buffers.", "positive"),
                insight("Payout gating", "Review", "One remittance approval is still waiting on finance sign-off.", "warning"),
            ],
        },
    };
}

export function createTenantConfigurationPage(tenantId: string): DashboardFormPageTemplateProps {
    return {
        pageTitle: "Configuration",
        pageDescription: `Workspace defaults and experience settings for ${tenantId}.`,
        tabs: formTabs,
        metrics: [
            metric("Configured modules", "9", "+1", "up", "More defaults are enabled", "Tenant-level capabilities currently turned on"),
            metric("Theme revisions", "4", "+1", "up", "Presentation changes are current", "Published storefront appearance versions"),
            metric("Routing variants", "3", "0%", "neutral", "Host mapping remains stable", "Primary plus alternate paths and redirects"),
            metric("Approval gates", "2", "+1", "up", "Safeguards increased slightly", "Manual checks required before promotion"),
        ],
        form: {
            title: "Workspace defaults",
            description: `Capture the tenant-specific defaults that operators expect for ${tenantId}.`,
            sections: [
                {
                    title: "Experience baseline",
                    description: "User-visible preferences applied across the tenant's managed surfaces.",
                    fields: [
                        { label: "Storefront theme", placeholder: "Harbor Slate" },
                        { label: "Default locale", placeholder: "en-US" },
                        { label: "Support contact", placeholder: "support@tenant.com", type: "email" },
                        { label: "Tenant notes", placeholder: "Document any experience-specific expectations", kind: "textarea" },
                    ],
                },
                {
                    title: "Operational defaults",
                    description: "Internal settings used by the admin team when managing this tenant.",
                    fields: [
                        { label: "Fallback redirect", placeholder: "https://shop.example.com", type: "url" },
                        { label: "Alert routing", placeholder: "ops-team" },
                        { label: "Launch approval group", placeholder: "tenant-launch-review" },
                    ],
                },
            ],
            submitLabel: "Save configuration",
        },
        notes: {
            title: "Configuration context",
            description: "Signals to keep in mind before changing workspace defaults.",
            items: [
                insight("Theme ownership", "Shared", "Storefront styling changes currently need both platform and tenant review.", "neutral"),
                insight("Redirect hygiene", "Good", "No routing drift was detected in the latest audit.", "positive"),
                insight("Approval burden", "Moderate", "Promotion still depends on two operator checkpoints.", "warning"),
            ],
        },
    };
}

export function createTenantFeatureFlagsPage(tenantId: string): DashboardTablePageTemplateProps {
    return {
        pageTitle: "Feature Flags",
        pageDescription: `Capability rollout status and gating for ${tenantId}.`,
        tabs: workspaceTabs,
        metrics: [
            metric("Flags enabled", "17", "+2", "up", "New capabilities were staged", "Tenant-specific features currently turned on"),
            metric("Preview features", "3", "0%", "neutral", "Experiment count is unchanged", "Features still behind additional review"),
            metric("Rollout coverage", "89%", "+4%", "up", "The tenant is nearing the current baseline", "Compared with managed default capability set"),
            metric("Operator overrides", "2", "-1", "down", "Temporary exceptions were reduced", "Flags deviating from baseline policy"),
        ],
        table: {
            title: "Flag rollout board",
            description: `Feature exposure for ${tenantId}, including exceptions that still require follow-up.`,
            columns: ["Capability", "Audience", "Variance", "State"],
            rows: [
                row("Branded auth routing", "Customer-facing sign-in", "Aligned with baseline", "Healthy", "positive"),
                row("Advanced ledger exports", "Finance operators", "Override still active", "Watching", "warning"),
                row("Theme staging tools", "Storefront editors", "Aligned with baseline", "Stable", "neutral"),
                row("Incident replay controls", "Platform operators", "Just enabled", "Healthy", "positive"),
            ],
            footer: "Use feature rollout tracking to keep tenant exceptions intentional rather than accidental drift.",
        },
        insights: {
            title: "Flag notes",
            description: "Why this tenant differs from the default capability mix.",
            items: [
                insight("Finance override", "Intentional", "Advanced exports remain gated while internal training finishes.", "warning"),
                insight("Customer-facing parity", "High", "Most user-visible capabilities now match the managed baseline.", "positive"),
                insight("Operator tooling", "Improving", "Internal controls are catching up with platform defaults.", "neutral"),
            ],
        },
    };
}

export function createTenantInfrastructurePage(tenantId: string): DashboardTablePageTemplateProps {
    return {
        pageTitle: "Infrastructure",
        pageDescription: `Runtime footprint, capacity posture, and deployment guardrails for ${tenantId}.`,
        tabs: workspaceTabs,
        metrics: [
            metric("Primary regions", "2", "0%", "neutral", "Regional coverage is stable", "Current serving footprint for storefront and auth"),
            metric("Edge cache hit", "91%", "+1.8%", "up", "Caching efficiency improved", "Traffic served without origin fallback"),
            metric("Deploy frequency", "6 / wk", "+1", "up", "Change velocity increased slightly", "Managed releases for this tenant"),
            metric("Incidents open", "0", "-2", "down", "No active tenant incidents", "Operational issues requiring direct intervention"),
        ],
        table: {
            title: "Infrastructure board",
            description: "Signals that summarize how the tenant is performing across its current runtime footprint.",
            columns: ["Surface", "Owner", "Variance", "State"],
            rows: [
                row("Storefront runtime", "Customer-facing web traffic", "Platform", "Within target latency", "Healthy", "positive"),
                row("Auth edge", "Clerk and tenant proxy traffic", "Security", "Stable", "Healthy", "positive"),
                row("Background workers", "Content and ledger jobs", "Platform", "One queue spike", "Watching", "warning"),
                row("Observability hooks", "Logs, traces, and alerts", "Platform", "Nominal", "Stable", "neutral"),
            ],
            footer: "Infrastructure monitoring focuses on tenant-specific runtime pressure that could justify scaling or release changes.",
        },
        insights: {
            title: "Capacity notes",
            description: "A short operational readout for the tenant's underlying runtime.",
            items: [
                insight("Origin pressure", "Low", "Cache hit improvements reduced origin dependency.", "positive"),
                insight("Background queue", "1 spike", "A single batch window briefly exceeded normal volume.", "warning"),
                insight("Incident posture", "Clear", "No infrastructure issue is currently unresolved.", "positive"),
            ],
        },
    };
}

export function createTenantLedgerPage(tenantId: string): DashboardTablePageTemplateProps {
    return {
        pageTitle: "Tenant Ledger",
        pageDescription: `Tenant-specific finance posture, statement readiness, and posting quality for ${tenantId}.`,
        tabs: workspaceTabs,
        metrics: [
            metric("Posting confidence", "99.2%", "+0.4%", "up", "Ledger integrity remains strong", "Validated across this tenant's recent activity"),
            metric("Pending reviews", "8", "-3", "down", "Finance queue is shrinking", "Manual items still needing confirmation"),
            metric("Reserve coverage", "On target", "+1", "up", "Protection policy remains funded", "Current tenant reserve posture"),
            metric("Statement readiness", "96%", "+2%", "up", "Most prerequisites are complete", "Tenant-facing reporting readiness"),
        ],
        table: {
            title: "Ledger checkpoints",
            description: `Posting and settlement signals most likely to affect ${tenantId}'s financial reporting.`,
            columns: ["Checkpoint", "Owner", "Variance", "State"],
            rows: [
                row("Order capture entries", "Automated journal generation", "Finance", "Within tolerance", "Healthy", "positive"),
                row("Refund and dispute flow", "Reverse and correction entries", "Risk", "2 manual checks", "Watching", "warning"),
                row("Reserve movement", "Tenant buffer and protection flows", "Treasury", "On target", "Stable", "neutral"),
                row("Statement generation", "Tenant-facing reporting pack", "Finance ops", "Ready", "Healthy", "positive"),
            ],
            footer: "Tenant ledger monitoring emphasizes reporting integrity and settlement confidence before each statement cycle.",
        },
        insights: {
            title: "Finance notes",
            description: "Short explanation of what matters most in the tenant ledger right now.",
            items: [
                insight("Posting quality", "Strong", "The tenant's journal flow remains highly automated and stable.", "positive"),
                insight("Refund reviews", "2 items", "A small number of edge-case reversals still need approval.", "warning"),
                insight("Statement timing", "On track", "No current blocker threatens the next statement window.", "positive"),
            ],
        },
    };
}

export function createTenantSentrySettingsPage(tenantId: string): DashboardFormPageTemplateProps {
    return {
        pageTitle: "Sentry Settings",
        pageDescription: `Observability defaults and alert routing for ${tenantId}.`,
        tabs: formTabs,
        metrics: [
            metric("Signal coverage", "94%", "+3%", "up", "More events now ship with context", "Tenant traces, logs, and release metadata"),
            metric("Alert channels", "5", "+1", "up", "Escalation coverage expanded", "Teams notified when this tenant regresses"),
            metric("Trace sampling", "12%", "0%", "neutral", "Current sampling rate is unchanged", "Applies to storefront and auth traffic"),
            metric("Issue hygiene", "High", "+2%", "up", "Noise reduction improved", "Actionable incidents compared with raw event volume"),
        ],
        form: {
            title: "Tenant observability defaults",
            description: `Define how ${tenantId} should emit, route, and retain production issue signals.`,
            sections: [
                {
                    title: "Project routing",
                    description: "Where tenant issues should be sent and who receives first response.",
                    fields: [
                        { label: "Primary DSN", placeholder: "https://example@sentry.io/123", type: "url" },
                        { label: "Environment label", placeholder: `${tenantId}-production` },
                        { label: "Escalation destination", placeholder: "tenant-ops-oncall" },
                    ],
                },
                {
                    title: "Signal quality",
                    description: "Sampling and filtering defaults that keep alerts actionable.",
                    fields: [
                        { label: "Trace sample rate", placeholder: "0.12" },
                        { label: "Replay sample rate", placeholder: "0.02" },
                        { label: "Noise suppression notes", placeholder: "Document ignore patterns or issue ownership rules", kind: "textarea" },
                    ],
                },
            ],
            submitLabel: "Save observability defaults",
        },
        notes: {
            title: "Observability notes",
            description: "What to keep in mind before changing tenant monitoring settings.",
            items: [
                insight("Sampling discipline", "Important", "Higher sample rates can affect volume-based budgets quickly.", "warning"),
                insight("Ownership mapping", "Healthy", "Most issue categories already have named responders.", "positive"),
                insight("Release tagging", "Required", "Version metadata is necessary for useful regression alerts.", "neutral"),
            ],
        },
    };
}
