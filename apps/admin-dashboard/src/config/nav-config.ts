import type { NavItem } from "@arch/ui-kit";

export const adminNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/",
        icon: "dashboard",
        isActive: false,
        items: [],
    },
    {
        title: "Tenants",
        url: "/tenants",
        icon: "tenants",
        isActive: false,
        items: [
            { title: "All Tenants", url: "/tenants" },
            { title: "Create Tenant", url: "/tenants/create" },
        ],
    },
    {
        title: "Users",
        url: "/users",
        icon: "users",
        isActive: false,
        items: [],
    },
    {
        title: "Ledger",
        url: "/ledger",
        icon: "ledger",
        isActive: true,
        items: [
            { title: "Overview", url: "/ledger" },
            { title: "Accounts", url: "/ledger/accounts" },
            { title: "Journal Entries", url: "/ledger/journal-entries" },
            { title: "Reconciliation", url: "/ledger/reconciliation" },
            { title: "Reports", url: "/ledger/reports" },
        ],
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: "analytics",
        isActive: false,
        items: [],
    },
    {
        title: "Settings",
        url: "/settings",
        icon: "settings",
        isActive: false,
        items: [],
    },
];
