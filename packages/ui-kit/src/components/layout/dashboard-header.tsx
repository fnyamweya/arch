"use client";

import * as React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumbs } from "./breadcrumbs";
import { DashboardSearchButton } from "./dashboard-search-button";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { UserNav } from "./user-nav";
import type { BreadcrumbItem } from "../../types";

interface DashboardHeaderProps {
    readonly routeMapping?: Record<string, BreadcrumbItem[]>;
    readonly profilePath?: string;
    readonly billingPath?: string;
    readonly settingsPath?: string;
    readonly signInPath?: string;
    readonly actions?: React.ReactNode;
}

export function DashboardHeader({
    routeMapping,
    profilePath,
    billingPath,
    settingsPath,
    signInPath,
    actions,
}: DashboardHeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs routeMapping={routeMapping} />
            </div>
            <div className="flex items-center gap-2 px-4">
                {actions}
                <div className="hidden md:flex">
                    <DashboardSearchButton />
                </div>
                <UserNav
                    profilePath={profilePath}
                    billingPath={billingPath}
                    settingsPath={settingsPath}
                    signInPath={signInPath}
                />
                <ThemeModeToggle />
            </div>
        </header>
    );
}
