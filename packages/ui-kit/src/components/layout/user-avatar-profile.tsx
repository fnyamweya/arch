"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProfileProps {
    readonly className?: string;
    readonly showInfo?: boolean;
    readonly user: {
        readonly imageUrl?: string;
        readonly fullName?: string | null;
        readonly emailAddresses: ReadonlyArray<{ readonly emailAddress: string }>;
    } | null;
}

export function UserAvatarProfile({ className, showInfo = false, user }: UserAvatarProfileProps) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className={className}>
                <AvatarImage src={user?.imageUrl ?? ""} alt={user?.fullName ?? ""} />
                <AvatarFallback className="rounded-lg">
                    {user?.fullName?.slice(0, 2)?.toUpperCase() ?? "U"}
                </AvatarFallback>
            </Avatar>
            {showInfo && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.fullName ?? ""}</span>
                    <span className="truncate text-xs">
                        {user?.emailAddresses[0]?.emailAddress ?? ""}
                    </span>
                </div>
            )}
        </div>
    );
}
