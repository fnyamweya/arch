import type { ReactNode } from "react";
import { DashboardShell } from "@arch/ui-kit";
import { cookies } from "next/headers";
import { vendorNavItems } from "../../config/nav-config";

export default async function VendorDashboardLayout(props: { readonly children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <DashboardShell
      navItems={vendorNavItems}
      defaultOpen={defaultOpen}
      groupLabel="Store Operations"
      workspaceTitle="Vendor Workspace"
      workspaceSubtitle="Merchant Control"
      workspaceIcon="store"
      profilePath="/settings"
      settingsPath="/settings"
      signInPath="/sign-in"
    >
      {props.children}
    </DashboardShell>
  );
}
