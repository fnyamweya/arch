import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export interface AuthMiddlewareConfig {
    readonly publicRoutes?: readonly string[];
    readonly ignoredRoutes?: readonly string[];
}

export function createAuthMiddleware(config?: AuthMiddlewareConfig) {
    const publicRoutes = config?.publicRoutes ?? [
        "/sign-in(.*)",
        "/sign-up(.*)",
        "/api/health",
        "/api/webhooks/(.*)",
    ];

    const isPublicRoute = createRouteMatcher(publicRoutes as string[]);

    return clerkMiddleware(async (auth, request) => {
        if (!isPublicRoute(request)) {
            await auth.protect();
        }
    });
}

export { clerkMiddleware, createRouteMatcher };
