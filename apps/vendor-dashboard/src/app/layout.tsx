import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@arch/ui-kit";
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
  title: "Vendor Dashboard",
  description: "Manage your products, orders, and payouts.",
};

export default function RootLayout(props: { readonly children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground overflow-x-hidden overscroll-none font-sans antialiased`}
      >
        <AppProviders>{props.children}</AppProviders>
      </body>
    </html>
  );
}
