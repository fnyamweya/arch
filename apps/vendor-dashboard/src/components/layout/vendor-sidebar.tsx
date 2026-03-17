const VENDOR_NAV_ITEMS: ReadonlyArray<{ readonly label: string }> = [
  { label: "Dashboard" },
  { label: "Products" },
  { label: "Orders" },
  { label: "Inventory" },
  { label: "Payouts" },
  { label: "Analytics" },
  { label: "Settings" }
];

export function VendorSidebar(): JSX.Element {
  return (
    <aside className="border-r p-4">
      <h2 className="font-semibold mb-4">Vendor Portal</h2>
      <nav className="space-y-2">
        {VENDOR_NAV_ITEMS.map((item) => (
          <div key={item.label} className="text-sm">
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
