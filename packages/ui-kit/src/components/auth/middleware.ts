import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURE_COOKIE_PREFIX = "__Secure-";

const parseCookies = (cookieHeader: string) => {
    const cookieMap = new Map<string, string>();

    for (const cookie of cookieHeader.split("; ")) {
        const [name, value] = cookie.split(/=(.*)/s);
        if (name && value) {
            cookieMap.set(name, value);
        }
    }

    return cookieMap;
};

const getSessionCookie = (request: Request | Headers) => {
    const headers = request instanceof Headers || !("headers" in request)
        ? request
        : request.headers;
    const cookies = headers.get("cookie");

    if (!cookies) {
        return null;
    }

    const parsedCookie = parseCookies(cookies);
    const getCookie = (name: string) =>
        parsedCookie.get(name) ?? parsedCookie.get(`${SECURE_COOKIE_PREFIX}${name}`) ?? null;

    return getCookie("better-auth.session_token") ?? getCookie("better-auth-session_token");
};

export interface AuthMiddlewareConfig {
    readonly publicRoutes?: readonly string[];
    readonly ignoredRoutes?: readonly string[];
}

const isMatchingRoute = (pathname: string, routes: readonly string[]) => {
    return routes.some((route) => new RegExp(route).test(pathname));
};

export function createAuthMiddleware(config?: AuthMiddlewareConfig) {
    const publicRoutes = config?.publicRoutes ?? [
        "/sign-in(.*)",
        "/sign-up(.*)",
        "/api/health",
        "/api/webhooks/(.*)",
    ];
    const ignoredRoutes = config?.ignoredRoutes ?? [];

    return (request: NextRequest) => {
        const pathname = request.nextUrl.pathname;
        if (isMatchingRoute(pathname, ignoredRoutes) || isMatchingRoute(pathname, publicRoutes)) {
            return NextResponse.next();
        }

        const sessionToken = getSessionCookie(request.headers);
        if (sessionToken !== null) {
            return NextResponse.next();
        }

        if (pathname.startsWith("/api/") || pathname.startsWith("/trpc")) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "UNAUTHORIZED",
                        message: "Authentication is required"
                    }
                },
                { status: 401 }
            );
        }

        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
        return NextResponse.redirect(signInUrl);
    };
}

export { getSessionCookie };
