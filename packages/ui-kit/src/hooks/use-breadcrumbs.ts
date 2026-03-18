"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { BreadcrumbItem } from "../types";

export function useBreadcrumbs(routeMapping?: Record<string, BreadcrumbItem[]>) {
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        if (routeMapping?.[pathname]) {
            return routeMapping[pathname];
        }

        const segments = pathname.split("/").filter(Boolean);
        return segments.map((segment, index) => {
            const path = `/${segments.slice(0, index + 1).join("/")}`;
            return {
                title: segment.charAt(0).toUpperCase() + segment.slice(1),
                link: path,
            };
        });
    }, [pathname, routeMapping]);

    return breadcrumbs;
}
