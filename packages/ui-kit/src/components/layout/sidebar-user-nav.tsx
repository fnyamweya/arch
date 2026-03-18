"use client";

import * as React from "react";
import {
    IconBell,
    IconChevronsDown,
    IconLogout,
    IconSettings,
    IconUserCircle,
} from "@tabler/icons-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { UserAvatarProfile } from "./user-avatar-profile";

interface SidebarUserNavProps {
    readonly profilePath?: string;
    readonly settingsPath?: string;
    readonly signInPath?: string;
}

export function SidebarUserNav({
    profilePath,
    settingsPath,
    signInPath = "/sign-in",
}: SidebarUserNavProps) {
    const { user } = useUser();
    const router = useRouter();

    if (!user) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <UserAvatarProfile
                                className="h-8 w-8 rounded-lg"
                                showInfo
                                user={user}
                            />
                            <IconChevronsDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="px-1 py-1.5">
                                <UserAvatarProfile
                                    className="h-8 w-8 rounded-lg"
                                    showInfo
                                    user={user}
                                />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {profilePath ? (
                                <DropdownMenuItem onClick={() => router.push(profilePath)}>
                                    <IconUserCircle className="mr-2 h-4 w-4" />
                                    Account
                                </DropdownMenuItem>
                            ) : null}
                            {settingsPath ? (
                                <DropdownMenuItem onClick={() => router.push(settingsPath)}>
                                    <IconSettings className="mr-2 h-4 w-4" />
                                    Preferences
                                </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem>
                                <IconBell className="mr-2 h-4 w-4" />
                                Alerts
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <IconLogout className="mr-2 h-4 w-4" />
                            <SignOutButton redirectUrl={signInPath} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
