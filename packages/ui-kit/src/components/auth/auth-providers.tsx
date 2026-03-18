"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

interface AuthProvidersProps {
    readonly children: React.ReactNode;
    readonly clerkPublishableKey?: string;
    readonly clerkDomain?: string;
    readonly clerkProxyUrl?: string;
}

export function AuthProviders({ children, clerkPublishableKey, clerkDomain, clerkProxyUrl }: AuthProvidersProps) {
    const { resolvedTheme } = useTheme();

    return (
        <ClerkProvider
            publishableKey={clerkPublishableKey}
            domain={clerkDomain}
            proxyUrl={clerkProxyUrl}
            appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
        >
            {children}
        </ClerkProvider>
    );
}
