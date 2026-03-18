"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authClient } from "./auth-client";
import { useRouter, useSearchParams } from "next/navigation";

interface SignInViewProps {
    readonly title?: string;
    readonly description?: string;
    readonly logoText?: string;
    readonly termsUrl?: string;
    readonly privacyUrl?: string;
}

function SignInViewContent({
    title,
    description,
    logoText = "Commerce",
    termsUrl = "/terms",
    privacyUrl = "/privacy",
}: SignInViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = authClient.useSession();
    const { data: providers } = authClient.useProviders();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const [credentialMode, setCredentialMode] = React.useState<"email" | "username" | "phone">("email");
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState(false);

    React.useEffect(() => {
        if (session?.user) {
            router.replace(callbackUrl);
            router.refresh();
        }
    }, [callbackUrl, router, session]);

    const postAuth = async (path: string, body: Record<string, unknown>) => {
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        });

        const payload = (await response.json().catch(() => null)) as
            | { error?: { message?: string }; url?: string; redirect?: boolean }
            | null;

        if (!response.ok) {
            throw new Error(payload?.error?.message ?? "Authentication failed");
        }

        return payload;
    };

    const handleCredentialSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsPending(true);

        try {
            if (credentialMode === "email") {
                await postAuth("/api/auth/sign-in/email", {
                    email,
                    password,
                    callbackURL: callbackUrl,
                    rememberMe: true,
                });
            }

            if (credentialMode === "username") {
                await postAuth("/api/auth/sign-in/username", {
                    username,
                    password,
                    callbackURL: callbackUrl,
                    rememberMe: true,
                });
            }

            if (credentialMode === "phone") {
                await postAuth("/api/auth/sign-in/phone-number", {
                    phoneNumber,
                    password,
                    rememberMe: true,
                });
            }

            router.replace(callbackUrl);
            router.refresh();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Authentication failed");
        } finally {
            setIsPending(false);
        }
    };

    const handleSocialSignIn = async (provider: "google" | "facebook") => {
        setError(null);
        setIsPending(true);

        try {
            const payload = await postAuth("/api/auth/sign-in/social", {
                provider,
                callbackURL: callbackUrl,
            });

            if (payload?.redirect === true && typeof payload.url === "string") {
                window.location.assign(payload.url);
                return;
            }

            router.replace(callbackUrl);
            router.refresh();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Social sign-in failed");
            setIsPending(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    {logoText}
                </div>
                <div className="relative z-20 mt-auto">
                    {(title || description) && (
                        <blockquote className="space-y-2">
                            {title && <p className="text-lg">&ldquo;{title}&rdquo;</p>}
                            {description && <footer className="text-sm">{description}</footer>}
                        </blockquote>
                    )}
                </div>
            </div>
            <div className="flex h-full items-center justify-center p-4 lg:p-8">
                <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
                    <div className="w-full rounded-2xl border bg-background p-6 shadow-sm">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                            <p className="text-muted-foreground text-sm">
                                Use email, username, phone number, or a social provider.
                            </p>
                        </div>
                        <div className="mt-6 grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
                            <Button
                                type="button"
                                variant={credentialMode === "email" ? "default" : "ghost"}
                                onClick={() => setCredentialMode("email")}
                            >
                                Email
                            </Button>
                            <Button
                                type="button"
                                variant={credentialMode === "username" ? "default" : "ghost"}
                                onClick={() => setCredentialMode("username")}
                            >
                                Username
                            </Button>
                            <Button
                                type="button"
                                variant={credentialMode === "phone" ? "default" : "ghost"}
                                onClick={() => setCredentialMode("phone")}
                            >
                                Phone
                            </Button>
                        </div>
                        <form className="mt-6 space-y-4" onSubmit={handleCredentialSignIn}>
                            {credentialMode === "email" ? (
                                <Input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            ) : null}
                            {credentialMode === "username" ? (
                                <Input
                                    type="text"
                                    placeholder="username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    required
                                />
                            ) : null}
                            {credentialMode === "phone" ? (
                                <Input
                                    type="tel"
                                    placeholder="+1 555 123 4567"
                                    value={phoneNumber}
                                    onChange={(event) => setPhoneNumber(event.target.value)}
                                    required
                                />
                            ) : null}
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                            {error ? <p className="text-sm text-red-600">{error}</p> : null}
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">or</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        {providers?.socialProviders.length ? (
                            <div className="grid grid-cols-2 gap-2">
                                {providers.socialProviders.includes("google") ? (
                                    <Button type="button" variant="outline" onClick={() => void handleSocialSignIn("google")}>
                                        Google
                                    </Button>
                                ) : null}
                                {providers.socialProviders.includes("facebook") ? (
                                    <Button type="button" variant="outline" onClick={() => void handleSocialSignIn("facebook")}>
                                        Facebook
                                    </Button>
                                ) : null}
                            </div>
                        ) : null}
                        <p className="text-muted-foreground mt-6 text-center text-sm">
                            Need an account? <a className="underline underline-offset-4" href="/sign-up">Create one</a>
                        </p>
                    </div>
                    <p className="text-muted-foreground px-8 text-center text-sm">
                        By clicking continue, you agree to our{" "}
                        <a href={termsUrl} className="hover:text-primary underline underline-offset-4">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href={privacyUrl} className="hover:text-primary underline underline-offset-4">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}

export function SignInView(props: SignInViewProps) {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
            <SignInViewContent {...props} />
        </React.Suspense>
    );
}
