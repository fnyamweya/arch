import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AppProviders } from "@arch/ui-kit";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse products and shop online.",
};

export default function RootLayout(props: { readonly children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{props.children}</AppProviders>
      </body>
    </html>
  );
}
