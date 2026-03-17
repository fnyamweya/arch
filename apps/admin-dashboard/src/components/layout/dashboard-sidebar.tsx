const NAV_ITEMS: ReadonlyArray<{ readonly label: string; readonly href: string }> = [
  { label: "Dashboard", href: "/(dashboard)" },
  { label: "Tenants", href: "/(dashboard)/tenants" },
  { label: "Users", href: "/(dashboard)/users" },
  { label: "Ledger", href: "/(dashboard)/ledger" },
  { label: "Analytics", href: "/(dashboard)/analytics" },
  { label: "Settings", href: "/(dashboard)/settings" }
];

export function DashboardSidebar(): JSX.Element {
  return (
    <aside className="border-r p-4">
      <h2 className="font-semibold mb-4">arch Admin</h2>
      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => (
          <div key={item.href} className="text-sm">
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
