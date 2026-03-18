"use client";

import * as React from "react";
import { Fragment } from "react";
import { IconSlash } from "@tabler/icons-react";
import { useBreadcrumbs } from "../../hooks/use-breadcrumbs";
import type { BreadcrumbItem as BreadcrumbItemType } from "../../types";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbsProps {
    readonly routeMapping?: Record<string, BreadcrumbItemType[]>;
}

export function Breadcrumbs({ routeMapping }: BreadcrumbsProps) {
    const items = useBreadcrumbs(routeMapping);
    if (items.length === 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={item.title}>
                        {index !== items.length - 1 && (
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
                            </BreadcrumbItem>
                        )}
                        {index < items.length - 1 && (
                            <BreadcrumbSeparator className="hidden md:block">
                                <IconSlash />
                            </BreadcrumbSeparator>
                        )}
                        {index === items.length - 1 && (
                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
