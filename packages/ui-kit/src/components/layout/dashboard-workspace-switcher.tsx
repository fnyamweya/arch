"use client";

import * as React from "react";
import { IconChevronsDown } from "@tabler/icons-react";
import { Icons, type Icon } from "../icons";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

interface DashboardWorkspaceSwitcherProps {
    readonly title: string;
    readonly subtitle: string;
    readonly icon?: keyof typeof Icons;
}

export function DashboardWorkspaceSwitcher({
    title,
    subtitle,
    icon = "logo",
}: DashboardWorkspaceSwitcherProps) {
    const WorkspaceIcon: Icon = Icons[icon];

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <WorkspaceIcon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{title}</span>
                        <span className="truncate text-xs">{subtitle}</span>
                    </div>
                    <IconChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
