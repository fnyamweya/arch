"use server";

import {
    createTenantOnboarding,
    type TenantOnboardingResponse,
    type TenantOnboardingUserInput,
    type TenantOnboardingUserRole,
} from "../../../../lib/internal-platform-api";

export interface CreateTenantActionState {
    readonly status: "idle" | "success" | "error";
    readonly message: string | null;
    readonly result: TenantOnboardingResponse | null;
}

export const initialCreateTenantActionState: CreateTenantActionState = {
    status: "idle",
    message: null,
    result: null,
};

const asOptionalString = (value: FormDataEntryValue | null): string | undefined => {
    if (typeof value !== "string") {
        return undefined;
    }

    const normalizedValue = value.trim();
    return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const buildUserInput = (
    formData: FormData,
    prefix: string,
    role: TenantOnboardingUserRole,
    required: boolean
): TenantOnboardingUserInput | null => {
    const name = asOptionalString(formData.get(`${prefix}Name`));
    const email = asOptionalString(formData.get(`${prefix}Email`));
    const password = asOptionalString(formData.get(`${prefix}Password`));

    if (name === undefined && email === undefined) {
        if (required) {
            throw new Error(`${role} requires both name and email.`);
        }
        return null;
    }

    if (name === undefined || email === undefined) {
        throw new Error(`${role} requires both name and email.`);
    }

    return {
        role,
        name,
        email,
        password,
    };
};

export async function createTenantAction(
    _previousState: CreateTenantActionState,
    formData: FormData
): Promise<CreateTenantActionState> {
    try {
        const tenantSlug = asOptionalString(formData.get("tenantSlug"));
        const displayName = asOptionalString(formData.get("displayName"));
        const primaryDomain = asOptionalString(formData.get("primaryDomain"));

        if (tenantSlug === undefined || displayName === undefined || primaryDomain === undefined) {
            return {
                status: "error",
                message: "Tenant slug, display name, and primary domain are required.",
                result: null,
            };
        }

        const users = [
            buildUserInput(formData, "platformAdmin", "PLATFORM_ADMIN", true),
            buildUserInput(formData, "tenantAdmin", "TENANT_ADMIN", true),
            buildUserInput(formData, "vendorOwner", "VENDOR_OWNER", false),
            buildUserInput(formData, "customer", "CUSTOMER", false),
        ].filter((user): user is TenantOnboardingUserInput => user !== null);

        const result = await createTenantOnboarding({
            tenantSlug,
            displayName,
            primaryDomain,
            users,
        });

        return {
            status: "success",
            message: `Tenant ${result.displayName} is ready.`,
            result,
        };
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Unable to create tenant.",
            result: null,
        };
    }
}