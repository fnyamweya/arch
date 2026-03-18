"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProviders } from "../auth/auth-providers";

interface AppProvidersProps {
    readonly children: React.ReactNode;
    readonly clerkPublishableKey?: string;
    readonly clerkDomain?: string;
    readonly clerkProxyUrl?: string;
}

export function AppProviders({ children, clerkPublishableKey, clerkDomain, clerkProxyUrl }: AppProvidersProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <AuthProviders
                clerkPublishableKey={clerkPublishableKey}
                clerkDomain={clerkDomain}
                clerkProxyUrl={clerkProxyUrl}
            >
                {children}
            </AuthProviders>
        </NextThemesProvider>
    );
}
