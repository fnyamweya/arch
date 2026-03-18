import { createAuthMiddleware } from "@arch/ui-kit";

export default createAuthMiddleware({
    publicRoutes: [
        "/sign-in(.*)",
        "/sign-up(.*)",
        "/api/health",
        "/api/webhooks/(.*)",
    ],
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
