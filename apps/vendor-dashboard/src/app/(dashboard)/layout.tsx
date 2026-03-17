import type { ReactNode } from "react";
import { VendorAppShell } from "../../components/layout/app-shell";

export default function VendorDashboardLayout(props: { readonly children: ReactNode }): JSX.Element {
  return <VendorAppShell>{props.children}</VendorAppShell>;
}
