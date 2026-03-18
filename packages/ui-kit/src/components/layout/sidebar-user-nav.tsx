"use client";

import * as React from "react";
import {
    IconBell,
    IconChevronsDown,
    IconLogout,
    IconSettings,
    IconUserCircle,
} from "@tabler/icons-react";
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
import { authClient } from "../auth/auth-client";

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
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = React.useState(false);

    const user = session?.user;

    if (!user) {
        return null;
    }

    const avatarUser = {
        imageUrl: user.image ?? undefined,
        fullName: user.name ?? null,
        emailAddresses: user.email ? [{ emailAddress: user.email }] : [],
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await authClient.signOut();
        } finally {
            router.push(signInPath);
            router.refresh();
            setIsSigningOut(false);
        }
    };

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
                                user={avatarUser}
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
                                    user={avatarUser}
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
                        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                            <IconLogout className="mr-2 h-4 w-4" />
                            {isSigningOut ? "Signing out..." : "Sign out"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
