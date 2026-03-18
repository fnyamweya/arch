import type {
    DashboardFormPageTemplateProps,
    DashboardOverviewTemplateProps,
    DashboardTablePageTemplateProps,
} from "@arch/ui-kit";

const overviewTabs = [
    { label: "Store view", active: true },
    { label: "Forecast", disabled: true },
] as const;

const workspaceTabs = [
    { label: "Overview", active: true },
    { label: "Optimization", disabled: true },
] as const;

const formTabs = [
    { label: "Preferences", active: true },
    { label: "Policies", disabled: true },
] as const;

const sprintLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;

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

export const vendorOverviewPage = {
    greeting: "Store performance at a glance",
    actionLabel: "Download report",
    tabs: overviewTabs,
    metrics: [
        metric("Net sales", "$412k", "+12.4%", "up", "Demand is accelerating", "Compared with the previous eight checkpoints"),
        metric("Open orders", "1,284", "+6.1%", "up", "Order volume remains healthy", "Across all active sales channels"),
        metric("In-stock rate", "96.4%", "+1.8%", "up", "Availability improved this cycle", "Weighted by top-selling catalog lines"),
        metric("Payouts pending", "$38k", "-9.7%", "down", "Settlement queue is clearing faster", "Awaiting next remittance release"),
    ],
    barChart: {
        title: "Revenue and order flow",
        description: "Gross demand compared with fulfillment movement over the current operating window.",
        labels: sprintLabels,
        series: [
            { label: "Revenue flow", total: "$412k", points: [42, 48, 53, 59, 63, 70, 74, 82] },
            { label: "Fulfillment flow", total: "1.28k", points: [28, 30, 35, 39, 43, 47, 50, 55] },
        ],
    },
    areaChart: {
        title: "Demand resilience",
        description: "Sales demand compared with replenishment throughput over the last six months.",
        labels: monthLabels,
        series: [
            { label: "Demand", points: [124, 161, 149, 188, 214, 236] },
            { label: "Replenishment", points: [88, 96, 105, 122, 134, 149] },
        ],
        footerTitle: "Demand is outpacing the historical baseline",
        footerNote: "Six-month trend built from recent order and receiving activity.",
    },
    donutChart: {
        title: "Channel contribution",
        description: "How current store activity is distributed across the major revenue drivers.",
        totalLabel: "channel mix",
        slices: [
            { label: "Direct site", value: 42 },
            { label: "Marketplaces", value: 27 },
            { label: "Wholesale", value: 18 },
            { label: "Reorders", value: 13 },
        ],
        footerTitle: "Direct demand is still the strongest contributor",
        footerNote: "Mix based on the latest reconciled weekly sales interval.",
    },
    activity: {
        title: "Recent store actions",
        description: "High-signal events that changed store performance or readiness this week.",
        items: [
            { title: "Campaign launch", subtitle: "New product story pushed live", value: "Ready", initials: "CL" },
            { title: "Fulfillment catch-up", subtitle: "Backorders cleared", value: "218 orders", initials: "FC" },
            { title: "Pricing update", subtitle: "Bundle offer refreshed", value: "3 SKUs", initials: "PU" },
            { title: "Restock posted", subtitle: "Core assortment replenished", value: "640 units", initials: "RP" },
        ],
    },
} satisfies DashboardOverviewTemplateProps;

export const vendorAnalyticsPage = {
    pageTitle: "Analytics",
    pageDescription: "Demand quality, retention signals, and merchandising performance across the store.",
    tabs: workspaceTabs,
    metrics: [
        metric("Returning buyers", "38%", "+4.1%", "up", "Repeat demand is improving", "Customers purchasing more than once this quarter"),
        metric("Average order value", "$86", "+3.8%", "up", "Basket quality remains healthy", "Weighted by completed orders"),
        metric("Cart recovery", "17%", "+2.0%", "up", "Merchandising nudges are working", "Recovered demand from abandoned carts"),
        metric("Refund pressure", "1.9%", "-0.6%", "down", "Returns remain controlled", "Share of orders that required refunds"),
    ],
    table: {
        title: "Demand board",
        description: "Commercial signals that explain what is driving store performance right now.",
        columns: ["Signal", "Window", "Variance", "State"],
        rows: [
            row("Repeat buyer growth", "Retention-led revenue expansion", "30-day rolling", "+4.1%", "Healthy", "positive"),
            row("Bundle performance", "Average basket depth", "Current campaign", "+6.8%", "Healthy", "positive"),
            row("Refund trend", "Return and replacement rate", "Month to date", "1.9%", "Stable", "neutral"),
            row("Marketplace margin", "External channel profitability", "Last 2 weeks", "Below target", "Watching", "warning"),
        ],
        footer: "The vendor dashboard emphasizes signals that directly influence cash generation, inventory planning, and margin quality.",
    },
    insights: {
        title: "Commercial notes",
        description: "Short readout on where the store should focus next.",
        items: [
            insight("Retention motion", "Strong", "Returning buyer growth is outperforming acquisition growth.", "positive"),
            insight("Marketplace margin", "Needs review", "One external channel is discounting too aggressively.", "warning"),
            insight("Refund quality", "Healthy", "Returns remain low for the current product mix.", "positive"),
        ],
    },
    barChart: {
        title: "Order cadence",
        description: "Sales flow compared with shipping movement across the current sprint.",
        labels: sprintLabels,
        series: [
            { label: "Orders", total: "1.28k", points: [36, 41, 45, 49, 52, 57, 60, 66] },
            { label: "Shipments", total: "1.11k", points: [24, 28, 31, 35, 39, 43, 47, 52] },
        ],
    },
    donutChart: {
        title: "Demand mix",
        description: "Contribution of the main store revenue channels over the latest reporting window.",
        totalLabel: "sales mix",
        slices: [
            { label: "Direct", value: 45 },
            { label: "Marketplace", value: 25 },
            { label: "Email", value: 18 },
            { label: "Wholesale", value: 12 },
        ],
        footerTitle: "Direct demand continues to do most of the work",
        footerNote: "Weighted from current weekly conversion and revenue data.",
    },
} satisfies DashboardTablePageTemplateProps;

export const vendorInventoryPage = {
    pageTitle: "Inventory",
    pageDescription: "Availability, replenishment pressure, and product-level stock quality.",
    tabs: workspaceTabs,
    metrics: [
        metric("Sell-through", "64%", "+5.1%", "up", "Core catalog is moving faster", "Weighted across active styles"),
        metric("Stockouts risk", "7 SKUs", "-3", "down", "Critical shortages were reduced", "Products likely to run out within the next cycle"),
        metric("Inbound units", "2.4k", "+14.2%", "up", "Restocking activity increased", "Confirmed purchase orders arriving soon"),
        metric("Days of cover", "29", "+2", "up", "Coverage improved slightly", "Estimated based on current order velocity"),
    ],
    table: {
        title: "Inventory watchlist",
        description: "Products and collections with the highest operational urgency for the merchant team.",
        columns: ["Segment", "Coverage", "Variance", "State"],
        rows: [
            row("Signature hoodies", "Top-selling replenishment-sensitive line", "18 days", "Demand above forecast", "Watching", "warning"),
            row("Essentials pack", "Reliable evergreen assortment", "41 days", "Within plan", "Healthy", "positive"),
            row("Limited capsule", "Seasonal low-depth offer", "12 days", "Intentional scarcity", "Stable", "neutral"),
            row("Accessories", "Low-complexity attach category", "35 days", "Restocked this week", "Healthy", "positive"),
        ],
        footer: "Inventory monitoring is centered on preventing stockouts without overcommitting cash to slow inventory.",
    },
    insights: {
        title: "Replenishment notes",
        description: "High-signal supply observations from the most recent cycle.",
        items: [
            insight("Fast mover risk", "7 SKUs", "A small number of hero products still need restock acceleration.", "warning"),
            insight("Inbound coverage", "Improving", "Recent purchase orders materially improved depth in core lines.", "positive"),
            insight("Seasonal exposure", "Contained", "Limited drops remain intentionally lean rather than underbought.", "neutral"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const vendorOrdersPage = {
    pageTitle: "Orders",
    pageDescription: "Current order backlog, fulfillment quality, and customer-facing flow health.",
    tabs: workspaceTabs,
    metrics: [
        metric("Orders today", "214", "+9.3%", "up", "Demand is trending upward", "New orders placed during the current day"),
        metric("Fulfillment SLA", "97.1%", "+1.6%", "up", "Operational responsiveness improved", "Orders shipped within internal SLA"),
        metric("Backorders", "29", "-8", "down", "Queue pressure is falling", "Orders waiting on unavailable inventory"),
        metric("Replacement cases", "11", "-2", "down", "Quality issues remain contained", "Orders needing a follow-up shipment"),
    ],
    table: {
        title: "Fulfillment board",
        description: "Operational order groupings with the highest merchant attention requirement.",
        columns: ["Queue", "Coverage", "Variance", "State"],
        rows: [
            row("Same-day picks", "Priority paid orders", "Today", "On pace", "Healthy", "positive"),
            row("Backorders", "Orders awaiting restock", "This week", "29 cases", "Watching", "warning"),
            row("International holds", "Orders waiting on customs docs", "Current batch", "6 cases", "Stable", "neutral"),
            row("Replacement shipments", "Corrective customer service flow", "Month to date", "11 cases", "Healthy", "positive"),
        ],
        footer: "This view highlights operational order cohorts where customer experience can deteriorate fastest if the team falls behind.",
    },
    insights: {
        title: "Fulfillment notes",
        description: "A compact readout on where order operations need attention.",
        items: [
            insight("Warehouse pace", "Strong", "Same-day picking is keeping up with current order intake.", "positive"),
            insight("Backorder queue", "29", "Restock timing still matters for a small set of hero products.", "warning"),
            insight("Replacement burden", "Low", "Corrective shipments remain inside expected operational bounds.", "positive"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const vendorPayoutsPage = {
    pageTitle: "Payouts",
    pageDescription: "Settlement readiness, expected remittances, and payout variance across channels.",
    tabs: workspaceTabs,
    metrics: [
        metric("Next remittance", "$38k", "+4.9%", "up", "Upcoming payout grew slightly", "Projected next settlement amount"),
        metric("Held reserves", "$11k", "-3.1%", "down", "Reserve pressure eased", "Funds still held back for risk coverage"),
        metric("Settlement lag", "2.1 days", "-6.7%", "down", "Funds are arriving faster", "Median delay between capture and payout"),
        metric("Adjusted payouts", "4", "-1", "down", "Fewer manual interventions were needed", "Payouts requiring merchant review"),
    ],
    table: {
        title: "Settlement board",
        description: "Payout groups and adjustments most likely to affect upcoming merchant cash flow.",
        columns: ["Source", "Window", "Variance", "State"],
        rows: [
            row("Direct site payouts", "Primary storefront sales", "Next cycle", "On schedule", "Healthy", "positive"),
            row("Marketplace settlements", "External channel remittances", "This week", "2 delayed batches", "Watching", "warning"),
            row("Wholesale remittances", "Invoice-backed payouts", "Current month", "Within plan", "Stable", "neutral"),
            row("Reserve releases", "Held-risk balance returns", "Next cycle", "Ready", "Healthy", "positive"),
        ],
        footer: "Payout monitoring gives the merchant a clearer sense of expected cash timing and where channel-specific delays remain.",
    },
    insights: {
        title: "Cash notes",
        description: "What matters most for the next payout window.",
        items: [
            insight("Marketplace lag", "2 batches", "One external channel is still posting remittances more slowly than usual.", "warning"),
            insight("Reserve pressure", "Lower", "Held coverage dropped as order quality improved.", "positive"),
            insight("Direct site payout", "Clear", "Primary storefront remittances remain predictable.", "positive"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const vendorProductsPage = {
    pageTitle: "Products",
    pageDescription: "Catalog quality, assortment pressure, and item-level attention areas for the merchant team.",
    actionLabel: "Add product",
    tabs: workspaceTabs,
    metrics: [
        metric("Active products", "132", "+7", "up", "Assortment breadth expanded", "Currently sellable catalog entries"),
        metric("Hero SKUs", "18", "+2", "up", "More items now drive the majority of demand", "Products carrying the highest revenue share"),
        metric("Content freshness", "89%", "+6%", "up", "Merchandising quality improved", "Products updated in the current quarter"),
        metric("Margin pressure", "9 SKUs", "-2", "down", "Pricing quality is improving", "Items with profitability below target"),
    ],
    table: {
        title: "Catalog board",
        description: "Products and assortments that need the most immediate merchandising attention.",
        columns: ["Segment", "Coverage", "Variance", "State"],
        rows: [
            row("Hero apparel", "Top-demand catalog group", "Content refreshed", "Healthy", "positive"),
            row("Marketplace exclusives", "Channel-specific assortment", "Margin below target", "Watching", "warning"),
            row("Bundles", "Basket-building offers", "Conversion above plan", "Healthy", "positive"),
            row("Archive styles", "Low-priority legacy stock", "No recent edits", "Stable", "neutral"),
        ],
        footer: "Merchandising actions usually start with hero products, channel-specific margin issues, and stale long-tail content.",
    },
    insights: {
        title: "Catalog notes",
        description: "Compact guidance for the next merchandising pass.",
        items: [
            insight("Content freshness", "Strong", "Most high-velocity products now have current copy and media.", "positive"),
            insight("Channel margin", "9 SKUs", "A small marketplace assortment still needs pricing attention.", "warning"),
            insight("Bundle conversion", "Improving", "Merchandising experiments are increasing basket depth.", "positive"),
        ],
    },
} satisfies DashboardTablePageTemplateProps;

export const vendorSettingsPage = {
    pageTitle: "Settings",
    pageDescription: "Store preferences, merchant operations defaults, and customer-facing experience controls.",
    tabs: formTabs,
    metrics: [
        metric("Live channels", "4", "+1", "up", "Distribution reach expanded", "Current sales channels connected to the store"),
        metric("Shipping rules", "12", "+2", "up", "Fulfillment logic became more granular", "Merchant-owned delivery policies"),
        metric("Notification flows", "7", "0%", "neutral", "Communication stack is stable", "Transactional and operator alerts"),
        metric("Tax regions", "18", "+3", "up", "Compliance coverage expanded", "Jurisdictions currently configured for selling"),
    ],
    form: {
        title: "Store controls",
        description: "Shape how the store behaves for customers, operators, and fulfillment partners.",
        sections: [
            {
                title: "Experience defaults",
                description: "Core storefront and support-facing preferences.",
                fields: [
                    { label: "Store display name", placeholder: "Northwind Supply" },
                    { label: "Support contact", placeholder: "support@northwind.com", type: "email" },
                    { label: "Primary sales channel", placeholder: "Direct storefront" },
                    { label: "Shipping note", placeholder: "Explain delivery expectations and cutoff times", kind: "textarea" },
                ],
            },
            {
                title: "Operational rules",
                description: "Defaults used by the merchant team when orders and payouts are processed.",
                fields: [
                    { label: "Default carrier", placeholder: "UPS Ground" },
                    { label: "Settlement account", placeholder: "Primary operating account" },
                    { label: "Return window", placeholder: "30 days" },
                ],
            },
        ],
        submitLabel: "Save store settings",
    },
    notes: {
        title: "Merchant notes",
        description: "Operational context around the current store configuration.",
        items: [
            insight("Channel expansion", "Active", "A new sales channel now needs consistent pricing and inventory policies.", "warning"),
            insight("Support readiness", "Healthy", "Customer communication defaults are already broadly in good shape.", "positive"),
            insight("Compliance coverage", "Improving", "Tax region expansion should be validated before the next launch.", "neutral"),
        ],
    },
    checklist: {
        title: "Before publishing",
        description: "Quick checks the merchant team usually performs before configuration changes go live.",
        items: [
            insight("Shipping and returns aligned", "Required", "Policy text should match the actual operational flow.", "neutral"),
            insight("Channel pricing reviewed", "Required", "Marketplace and direct prices should stay intentionally different or aligned.", "neutral"),
            insight("Support contact tested", "Required", "Customer-facing support pathways should be reachable before publishing.", "neutral"),
        ],
    },
} satisfies DashboardFormPageTemplateProps;
