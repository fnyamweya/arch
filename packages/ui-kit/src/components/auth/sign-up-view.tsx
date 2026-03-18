"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authClient } from "./auth-client";
import { useRouter, useSearchParams } from "next/navigation";

interface SignUpViewProps {
    readonly title?: string;
    readonly description?: string;
    readonly logoText?: string;
    readonly termsUrl?: string;
    readonly privacyUrl?: string;
}

function SignUpViewContent({
    title,
    description,
    logoText = "Commerce",
    termsUrl = "/terms",
    privacyUrl = "/privacy",
}: SignUpViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = authClient.useSession();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState(false);

    React.useEffect(() => {
        if (session?.user) {
            router.replace(callbackUrl);
            router.refresh();
        }
    }, [callbackUrl, router, session]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsPending(true);

        try {
            const response = await fetch("/api/auth/sign-up/email", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    username,
                    callbackURL: callbackUrl,
                    rememberMe: true,
                }),
            });
            const payload = (await response.json().catch(() => null)) as
                | { error?: { message?: string } }
                | null;

            if (!response.ok) {
                throw new Error(payload?.error?.message ?? "Sign-up failed");
            }

            router.replace(callbackUrl);
            router.refresh();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Sign-up failed");
        } finally {
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
                            <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
                            <p className="text-muted-foreground text-sm">
                                Create a first-party Better Auth account with email, password, and username.
                            </p>
                        </div>
                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                            <Input
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                            <Input
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                            {error ? <p className="text-sm text-red-600">{error}</p> : null}
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Creating account..." : "Create account"}
                            </Button>
                        </form>
                        <p className="text-muted-foreground mt-6 text-center text-sm">
                            Already have an account? <a className="underline underline-offset-4" href="/sign-in">Sign in</a>
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

export function SignUpView(props: SignUpViewProps) {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
            <SignUpViewContent {...props} />
        </React.Suspense>
    );
}
