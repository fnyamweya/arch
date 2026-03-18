import * as React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Heading } from "../ui/heading";

function PageSkeleton() {
    return (
        <div className="flex flex-1 animate-pulse flex-col gap-4 p-4 md:px-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="bg-muted mb-2 h-8 w-48 rounded" />
                    <div className="bg-muted h-4 w-96 rounded" />
                </div>
            </div>
            <div className="bg-muted mt-6 h-40 w-full rounded-lg" />
            <div className="bg-muted h-40 w-full rounded-lg" />
        </div>
    );
}

export interface PageContainerProps {
    readonly children?: React.ReactNode;
    readonly scrollable?: boolean;
    readonly isLoading?: boolean;
    readonly pageTitle?: string;
    readonly pageDescription?: string;
    readonly pageHeaderAction?: React.ReactNode;
}

export function PageContainer({
    children,
    scrollable = true,
    isLoading = false,
    pageTitle,
    pageDescription,
    pageHeaderAction,
}: PageContainerProps) {
    const content = isLoading ? <PageSkeleton /> : children;

    const inner = (
        <div className="flex flex-1 flex-col p-4 md:px-6">
            {(pageTitle || pageHeaderAction) && (
                <div className="mb-4 flex items-start justify-between">
                    {pageTitle && (
                        <Heading title={pageTitle} description={pageDescription ?? ""} />
                    )}
                    {pageHeaderAction && <div>{pageHeaderAction}</div>}
                </div>
            )}
            {content}
        </div>
    );

    if (scrollable) {
        return <ScrollArea className="h-[calc(100dvh-52px)]">{inner}</ScrollArea>;
    }

    return inner;
}
