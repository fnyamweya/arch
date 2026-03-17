import type { ReactNode } from "react";
import { VendorSidebar } from "./vendor-sidebar";
import { VendorTopbar } from "./vendor-topbar";

interface VendorAppShellProps {
  readonly children: ReactNode;
}

export function VendorAppShell(props: VendorAppShellProps): JSX.Element {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <VendorSidebar />
      <div className="flex flex-col">
        <VendorTopbar />
        <main className="p-6">{props.children}</main>
      </div>
    </div>
  );
}
