"use client";

import * as React from "react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserAvatarProfile } from "./user-avatar-profile";
import { IconLogout, IconUserCircle, IconSettings, IconCreditCard } from "@tabler/icons-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface UserNavProps {
    readonly profilePath?: string;
    readonly billingPath?: string;
    readonly settingsPath?: string;
    readonly signInPath?: string;
}

export function UserNav({
    profilePath,
    billingPath,
    settingsPath,
    signInPath = "/sign-in",
}: UserNavProps) {
    const { user } = useUser();
    const router = useRouter();

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserAvatarProfile user={user} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={10} forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">{user.fullName}</p>
                        <p className="text-muted-foreground text-xs leading-none">
                            {user.emailAddresses[0]?.emailAddress}
                        </p>
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
                    {billingPath && (
                        <DropdownMenuItem onClick={() => router.push(billingPath)}>
                            <IconCreditCard className="mr-2 h-4 w-4" />
                            Billing
                        </DropdownMenuItem>
                    )}
                    {settingsPath && (
                        <DropdownMenuItem onClick={() => router.push(settingsPath)}>
                            <IconSettings className="mr-2 h-4 w-4" />
                            Preferences
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <IconLogout className="mr-2 h-4 w-4" />
                    <SignOutButton redirectUrl={signInPath} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
