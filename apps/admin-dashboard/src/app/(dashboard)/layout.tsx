import type { ReactNode } from "react";
import { DashboardShell } from "@arch/ui-kit";
import { cookies } from "next/headers";
import { adminNavItems } from "../../config/nav-config";

export default async function AdminDashboardLayout(props: { readonly children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <DashboardShell
      navItems={adminNavItems}
      defaultOpen={defaultOpen}
      groupLabel="Operations"
      workspaceTitle="Admin Console"
      workspaceSubtitle="Platform Control"
      workspaceIcon="dashboard"
      profilePath="/settings"
      signInPath="/sign-in"
      settingsPath="/settings"
    >
      {props.children}
    </DashboardShell>
  );
}
