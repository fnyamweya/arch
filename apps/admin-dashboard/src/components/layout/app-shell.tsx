import type { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell(props: AppShellProps): JSX.Element {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <DashboardSidebar />
      <div className="flex flex-col">
        <DashboardTopbar />
        <main className="p-6">{props.children}</main>
      </div>
    </div>
  );
}
