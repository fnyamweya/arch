import type { ReactNode } from "react";
import { StoreShell } from "../../components/layout/store-shell";

export default function StoreLayout(props: { readonly children: ReactNode }): JSX.Element {
  return <StoreShell>{props.children}</StoreShell>;
}
