"use client";

import * as React from "react";
import Link from "next/link";
import { UserNav } from "./user-nav";
import { cn } from "../../lib/utils";
import type { NavItem } from "../../types";

interface StoreShellProps {
    readonly children: React.ReactNode;
    readonly navItems?: readonly NavItem[];
    readonly storeName?: string;
    readonly profilePath?: string;
    readonly billingPath?: string;
    readonly settingsPath?: string;
    readonly signInPath?: string;
    readonly headerActions?: React.ReactNode;
}

export function StoreShell({
    children,
    navItems,
    storeName = "Store",
    profilePath,
    billingPath,
    settingsPath,
    signInPath,
    headerActions,
}: StoreShellProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center gap-4 px-4">
                    <Link href="/" className="font-semibold text-lg">
                        {storeName}
                    </Link>
                    {navItems && navItems.length > 0 && (
                        <nav className="hidden md:flex items-center gap-6 ml-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    className={cn(
                                        "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                        {headerActions}
                        <UserNav
                            profilePath={profilePath}
                            billingPath={billingPath}
                            settingsPath={settingsPath}
                            signInPath={signInPath}
                        />
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </div>
    );
}
