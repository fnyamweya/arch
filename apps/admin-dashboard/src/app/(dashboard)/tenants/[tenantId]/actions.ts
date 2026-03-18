"use server";

import { redirect } from "next/navigation";
import {
    createTenantDomain,
    deleteTenantDomain,
    makeTenantDomainPrimary
} from "../../../../lib/internal-platform-api";

const asOptionalString = (value: FormDataEntryValue | null): string | undefined => {
    if (typeof value !== "string") {
        return undefined;
    }
    const normalizedValue = value.trim();
    return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const redirectWithStatus = (path: string, status: "success" | "error", message: string): never => {
    const query = new URLSearchParams({ status, message });
    redirect(`${path}?${query.toString()}`);
};

export async function addTenantDomainAction(formData: FormData): Promise<void> {
    const tenantId = asOptionalString(formData.get("tenantId"));
    const domain = asOptionalString(formData.get("domain"));
    const path = `/tenants/${tenantId ?? "unknown"}/domains`;
    if (tenantId === undefined || domain === undefined) {
        redirectWithStatus(path, "error", "Tenant id and domain are required.");
    }
    const resolvedTenantId: string = tenantId!;
    const resolvedDomain: string = domain!;
    try {
        await createTenantDomain({
            tenantId: resolvedTenantId,
            domain: resolvedDomain,
            isPrimary: formData.get("isPrimary") === "on"
        });
        redirectWithStatus(path, "success", "Domain saved.");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save domain.";
        redirectWithStatus(path, "error", message);
    }
}

export async function setPrimaryTenantDomainAction(formData: FormData): Promise<void> {
    const tenantId = asOptionalString(formData.get("tenantId"));
    const domain = asOptionalString(formData.get("domain"));
    const path = `/tenants/${tenantId ?? "unknown"}/domains`;
    if (tenantId === undefined || domain === undefined) {
        redirectWithStatus(path, "error", "Tenant id and domain are required.");
    }
    const resolvedTenantId: string = tenantId!;
    const resolvedDomain: string = domain!;
    try {
        await makeTenantDomainPrimary({ tenantId: resolvedTenantId, domain: resolvedDomain });
        redirectWithStatus(path, "success", "Primary domain updated.");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to update primary domain.";
        redirectWithStatus(path, "error", message);
    }
}

export async function removeTenantDomainAction(formData: FormData): Promise<void> {
    const tenantId = asOptionalString(formData.get("tenantId"));
    const domain = asOptionalString(formData.get("domain"));
    const path = `/tenants/${tenantId ?? "unknown"}/domains`;
    if (tenantId === undefined || domain === undefined) {
        redirectWithStatus(path, "error", "Tenant id and domain are required.");
    }
    const resolvedTenantId: string = tenantId!;
    const resolvedDomain: string = domain!;
    try {
        await deleteTenantDomain({ tenantId: resolvedTenantId, domain: resolvedDomain });
        redirectWithStatus(path, "success", "Domain removed.");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to remove domain.";
        redirectWithStatus(path, "error", message);
    }
}