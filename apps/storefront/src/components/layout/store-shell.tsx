import type { ReactNode } from "react";
import { StoreTopbar } from "./store-topbar";

interface StoreShellProps {
  readonly children: ReactNode;
}

export function StoreShell(props: StoreShellProps): JSX.Element {
  return (
    <div className="min-h-screen">
      <StoreTopbar />
      <main className="p-6">{props.children}</main>
    </div>
  );
}
