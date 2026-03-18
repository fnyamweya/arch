"use client";

import * as React from "react";
import { Icons } from "../icons";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import type { NavItem, BreadcrumbItem } from "../../types";
import { AppSidebar } from "./app-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardWorkspaceSwitcher } from "./dashboard-workspace-switcher";
import { SidebarUserNav } from "./sidebar-user-nav";

interface DashboardShellProps {
    readonly children: React.ReactNode;
    readonly navItems: readonly NavItem[];
    readonly groupLabel?: string;
    readonly sidebarHeader?: React.ReactNode;
    readonly sidebarFooter?: React.ReactNode;
    readonly defaultOpen?: boolean;
    readonly routeMapping?: Record<string, BreadcrumbItem[]>;
    readonly profilePath?: string;
    readonly billingPath?: string;
    readonly settingsPath?: string;
    readonly signInPath?: string;
    readonly headerActions?: React.ReactNode;
    readonly workspaceTitle?: string;
    readonly workspaceSubtitle?: string;
    readonly workspaceIcon?: keyof typeof Icons;
}

export function DashboardShell({
    children,
    navItems,
    groupLabel,
    sidebarHeader,
    sidebarFooter,
    defaultOpen = true,
    routeMapping,
    profilePath,
    billingPath,
    settingsPath,
    signInPath,
    headerActions,
    workspaceTitle,
    workspaceSubtitle,
    workspaceIcon = "logo",
}: DashboardShellProps) {
    const resolvedSidebarHeader =
        sidebarHeader ??
        (workspaceTitle && workspaceSubtitle ? (
            <DashboardWorkspaceSwitcher
                title={workspaceTitle}
                subtitle={workspaceSubtitle}
                icon={workspaceIcon}
            />
        ) : undefined);

    const resolvedSidebarFooter =
        sidebarFooter ?? (
            <SidebarUserNav
                profilePath={profilePath}
                settingsPath={settingsPath}
                signInPath={signInPath}
            />
        );

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar
                navItems={navItems}
                groupLabel={groupLabel}
                header={resolvedSidebarHeader}
                footer={resolvedSidebarFooter}
            />
            <SidebarInset>
                <DashboardHeader
                    routeMapping={routeMapping}
                    profilePath={profilePath}
                    billingPath={billingPath}
                    settingsPath={settingsPath}
                    signInPath={signInPath}
                    actions={headerActions}
                />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
