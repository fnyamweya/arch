import type { ReactNode } from "react";
import { StoreShell } from "@arch/ui-kit";
import { storeNavItems } from "../../config/nav-config";

export default function StoreLayout(props: { readonly children: ReactNode }) {
  return (
    <StoreShell
      navItems={storeNavItems}
      storeName="Store"
      signInPath="/sign-in"
    >
      {props.children}
    </StoreShell>
  );
}
