"use client";

import * as React from "react";

interface AuthProvidersProps {
    readonly children: React.ReactNode;
}

export function AuthProviders({ children }: AuthProvidersProps) {
    return children;
}
