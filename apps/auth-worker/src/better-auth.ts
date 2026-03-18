import { betterAuth } from "better-auth";
import { admin, organization, phoneNumber, username } from "better-auth/plugins";
import type { AuthBindings } from "@arch/cloudflare-bindings";

const DEFAULT_TRUSTED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
];

const parseTrustedOrigins = (value: string | undefined) => {
    if (value === undefined) {
        return DEFAULT_TRUSTED_ORIGINS;
    }

    const configuredOrigins = value
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);

    return Array.from(new Set([...DEFAULT_TRUSTED_ORIGINS, ...configuredOrigins]));
};

const resolveSocialProviderNames = (env: AuthBindings) => {
    const providers: Array<"google" | "facebook"> = [];

    if (env.BETTER_AUTH_GOOGLE_CLIENT_ID && env.BETTER_AUTH_GOOGLE_CLIENT_SECRET) {
        providers.push("google");
    }

    if (env.BETTER_AUTH_FACEBOOK_CLIENT_ID && env.BETTER_AUTH_FACEBOOK_CLIENT_SECRET) {
        providers.push("facebook");
    }

    return providers;
};

const syncGlobalUser = async (
    env: AuthBindings,
    user: {
        readonly id: string;
        readonly email?: string | null;
        readonly name?: string | null;
        readonly image?: string | null;
        readonly createdAt?: Date;
        readonly updatedAt?: Date;
    }
) => {
    const now = Date.now();
    const createdAt = user.createdAt?.getTime() ?? now;
    const updatedAt = user.updatedAt?.getTime() ?? now;

    await env.PLATFORM_DB.prepare(
        `
			INSERT INTO global_users (
				id,
				primary_email,
				first_name,
				last_name,
				image_url,
				created_at,
				updated_at
			)
            VALUES (?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET
				primary_email = excluded.primary_email,
				image_url = excluded.image_url,
				updated_at = excluded.updated_at
		`
    )
        .bind(
            user.id,
            user.email ?? null,
            user.name ?? null,
            null,
            user.image ?? null,
            createdAt,
            updatedAt
        )
        .run();
};

const resolveSocialProviders = (env: AuthBindings) => {
    const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

    if (env.BETTER_AUTH_GOOGLE_CLIENT_ID && env.BETTER_AUTH_GOOGLE_CLIENT_SECRET) {
        socialProviders.google = {
            clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
        };
    }

    if (env.BETTER_AUTH_FACEBOOK_CLIENT_ID && env.BETTER_AUTH_FACEBOOK_CLIENT_SECRET) {
        socialProviders.facebook = {
            clientId: env.BETTER_AUTH_FACEBOOK_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_FACEBOOK_CLIENT_SECRET,
        };
    }

    return socialProviders;
};

export const getAuthConfigurationSummary = (env: AuthBindings, tenantId: string | null = null) => {
    return {
        scope: "platform" as const,
        tenantId,
        appName: "Arch Commerce",
        tenantScopedConfiguration: false,
        trustedOrigins: parseTrustedOrigins(env.BETTER_AUTH_TRUSTED_ORIGINS),
        cookieDomain: env.BETTER_AUTH_COOKIE_DOMAIN ?? null,
        credentialStrategies: ["email", "username", "phone"] as const,
        socialProviders: resolveSocialProviderNames(env),
        organizationEnabled: true,
        adminEnabled: true,
        phoneOtpWebhookConfigured: Boolean(env.PHONE_OTP_WEBHOOK_URL),
    };
};

const sendPhoneOtp = async (
    env: AuthBindings,
    payload: { readonly phoneNumber: string; readonly code: string }
) => {
    if (env.PHONE_OTP_WEBHOOK_URL) {
        await fetch(env.PHONE_OTP_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        return;
    }

    console.info(`Better Auth OTP for ${payload.phoneNumber}: ${payload.code}`);
};

export const createAuth = (env: AuthBindings) => {
    return betterAuth({
        appName: "Arch Commerce",
        secret: env.BETTER_AUTH_SECRET,
        database: env.PLATFORM_DB,
        basePath: "/api/auth",
        trustedOrigins: parseTrustedOrigins(env.BETTER_AUTH_TRUSTED_ORIGINS),
        emailAndPassword: {
            enabled: true,
        },
        socialProviders: resolveSocialProviders(env),
        advanced: {
            trustedProxyHeaders: true,
            crossSubDomainCookies: env.BETTER_AUTH_COOKIE_DOMAIN
                ? {
                    enabled: true,
                    domain: env.BETTER_AUTH_COOKIE_DOMAIN,
                }
                : undefined,
        },
        databaseHooks: {
            user: {
                create: {
                    after: async (user) => {
                        await syncGlobalUser(env, user);
                    },
                },
                update: {
                    after: async (user) => {
                        await syncGlobalUser(env, user);
                    },
                },
            },
        },
        plugins: [
            username(),
            phoneNumber({
                sendOTP: async ({ phoneNumber, code }) => {
                    await sendPhoneOtp(env, { phoneNumber, code });
                },
                sendPasswordResetOTP: async ({ phoneNumber, code }) => {
                    await sendPhoneOtp(env, { phoneNumber, code });
                },
                requireVerification: false,
                signUpOnVerification: {
                    getTempEmail: (phoneNumber) => {
                        const normalized = phoneNumber.replace(/[^a-zA-Z0-9]/g, "");
                        return `${normalized}@phone.arch.internal`;
                    },
                    getTempName: (phoneNumber) => `User ${phoneNumber}`,
                },
            }),
            organization(),
            admin(),
        ],
    });
};