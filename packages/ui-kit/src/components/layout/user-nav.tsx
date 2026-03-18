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
import { useRouter } from "next/navigation";
import { authClient } from "../auth/auth-client";

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
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = React.useState(false);

    const user = session?.user;

    if (!user) return null;

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

    const avatarUser = {
        imageUrl: user.image ?? undefined,
        fullName: user.name ?? null,
        emailAddresses: user.email ? [{ emailAddress: user.email }] : [],
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserAvatarProfile user={avatarUser} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={10} forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs leading-none">
                            {user.email}
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
                <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                    <IconLogout className="mr-2 h-4 w-4" />
                    {isSigningOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
