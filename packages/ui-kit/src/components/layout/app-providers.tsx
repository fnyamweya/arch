"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProviders } from "../auth/auth-providers";

interface AppProvidersProps {
    readonly children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <AuthProviders>{children}</AuthProviders>
        </NextThemesProvider>
    );
}
