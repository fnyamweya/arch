import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@arch/ui-kit";
import { resolveTenantForCurrentHost } from "../lib/internal-platform-api";
import "../styles/globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Platform Administration Dashboard",
  robots: { index: false, follow: false },
};

export default async function RootLayout(props: { readonly children: ReactNode }) {
  const tenant = await resolveTenantForCurrentHost();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground overflow-x-hidden overscroll-none font-sans antialiased`}
      >
        <AppProviders
          clerkPublishableKey={tenant?.clerkPublishableKey ?? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          clerkDomain={tenant?.clerkAuthDomain ?? undefined}
          clerkProxyUrl={tenant?.clerkProxyUrl ?? undefined}
        >
          {props.children}
        </AppProviders>
      </body>
    </html>
  );
}
