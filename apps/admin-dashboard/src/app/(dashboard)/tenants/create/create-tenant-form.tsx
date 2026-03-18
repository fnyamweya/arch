"use client";

import * as React from "react";
import Link from "next/link";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    PageContainer,
} from "@arch/ui-kit";
import {
    createTenantAction,
    initialCreateTenantActionState,
} from "./actions";

function Field({
    label,
    name,
    type = "text",
    placeholder,
    helper,
    required = false,
}: {
    readonly label: string;
    readonly name: string;
    readonly type?: React.HTMLInputTypeAttribute;
    readonly placeholder?: string;
    readonly helper?: string;
    readonly required?: boolean;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium text-foreground">
            <span>{label}</span>
            <Input name={name} type={type} placeholder={placeholder} required={required} />
            {helper ? <span className="text-xs font-normal text-muted-foreground">{helper}</span> : null}
        </label>
    );
}

function UserSection({
    title,
    description,
    prefix,
    required,
}: {
    readonly title: string;
    readonly description: string;
    readonly prefix: string;
    readonly required: boolean;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Name" name={`${prefix}Name`} placeholder="Alex Morgan" required={required} />
                <Field label="Email" name={`${prefix}Email`} type="email" placeholder="alex@example.com" required={required} />
                <div className="md:col-span-2">
                    <Field
                        label="Password"
                        name={`${prefix}Password`}
                        type="password"
                        placeholder="Leave blank to generate a one-time password"
                        helper="If omitted, onboarding generates a temporary password and returns it once."
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export function CreateTenantForm() {
    const [state, formAction, pending] = React.useActionState(createTenantAction, initialCreateTenantActionState);

    return (
        <PageContainer>
            <div className="grid gap-6 py-6">
                <div className="grid gap-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Create Tenant</h1>
                    <p className="max-w-3xl text-sm text-muted-foreground">
                        Provision a tenant, seed baseline resources, and bootstrap Better Auth users in a single workflow.
                    </p>
                </div>

                {state.message ? (
                    <div
                        className={state.status === "error"
                            ? "rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                            : "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"}
                    >
                        {state.message}
                    </div>
                ) : null}

                <form action={formAction} className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tenant Profile</CardTitle>
                            <CardDescription>
                                These values define the tenant identity, canonical domain, and seeded defaults.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <Field label="Display name" name="displayName" placeholder="Northwind Commerce" required />
                            <Field label="Tenant slug" name="tenantSlug" placeholder="northwind" required />
                            <div className="md:col-span-2">
                                <Field
                                    label="Primary domain"
                                    name="primaryDomain"
                                    placeholder="northwind.africasokoni.co.ke"
                                    helper="Host only. Full URLs are normalized to their hostname."
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <UserSection
                        title="Platform Admin"
                        description="Cross-platform operator seeded into Better Auth and attached to the new tenant context."
                        prefix="platformAdmin"
                        required
                    />

                    <UserSection
                        title="Tenant Admin"
                        description="Primary tenant operator with tenant-scoped administrative access."
                        prefix="tenantAdmin"
                        required
                    />

                    <UserSection
                        title="Vendor Owner"
                        description="Optional seeded vendor identity. If provided, onboarding links this user to the default vendor record."
                        prefix="vendorOwner"
                        required={false}
                    />

                    <UserSection
                        title="Customer"
                        description="Optional seeded shopper identity for sign-in and tenant membership validation."
                        prefix="customer"
                        required={false}
                    />

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={pending}>
                            {pending ? "Provisioning..." : "Provision tenant"}
                        </Button>
                        {state.result ? (
                            <Button variant="outline" asChild>
                                <Link href={`/tenants/${state.result.tenantId}`}>Open tenant</Link>
                            </Button>
                        ) : null}
                    </div>
                </form>

                {state.result ? (
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Generated credentials</CardTitle>
                                <CardDescription>
                                    Temporary passwords are shown once. Rotate them after first sign-in.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                {state.result.seededUsers.map((user) => (
                                    <div key={user.role} className="rounded-lg border border-border bg-background px-4 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold">{user.role}</div>
                                                <div className="text-sm text-muted-foreground">{user.name} · {user.email}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs uppercase tracking-wide text-muted-foreground">One-time password</div>
                                                <div className="font-mono text-sm">{user.password}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Seeded resources</CardTitle>
                                <CardDescription>
                                    The onboarding API created the default control-plane footprint for this tenant.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div>
                                    <div className="font-medium">Tenant</div>
                                    <div className="text-muted-foreground">{state.result.tenantId}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Primary domain</div>
                                    <div className="text-muted-foreground">{state.result.tenantDomain}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Storefront</div>
                                    <div className="text-muted-foreground">{state.result.seededResources.storefrontId}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Vendor</div>
                                    <div className="text-muted-foreground">{state.result.seededResources.vendorId}</div>
                                </div>
                                <div>
                                    <div className="font-medium">Infrastructure</div>
                                    <div className="text-muted-foreground">D1: {state.result.seededResources.infrastructure.d1DatabaseId}</div>
                                    <div className="text-muted-foreground">KV: {state.result.seededResources.infrastructure.kvNamespaceId}</div>
                                    <div className="text-muted-foreground">R2: {state.result.seededResources.infrastructure.r2BucketName}</div>
                                    <div className="text-muted-foreground">Queue: {state.result.seededResources.infrastructure.queueName}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </div>
        </PageContainer>
    );
}