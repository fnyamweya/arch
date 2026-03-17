import type { ReactNode } from "react";
import { AppShell } from "../../components/layout/app-shell";

export default function AdminDashboardLayout(props: { readonly children: ReactNode }): JSX.Element {
  return <AppShell>{props.children}</AppShell>;
}
