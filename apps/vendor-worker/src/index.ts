import { Hono } from "hono";
import type { VendorBindings } from "@arch/cloudflare-bindings";
import { approveVendor } from "./application/commands/approve-vendor";
import { configurePayout } from "./application/commands/configure-payout";
import { registerVendor } from "./application/commands/register-vendor";
import { suspendVendor } from "./application/commands/suspend-vendor";
import { getPayoutHistory } from "./application/queries/get-payout-history";
import { getVendorAnalytics } from "./application/queries/get-vendor-analytics";
import { getVendorProfile } from "./application/queries/get-vendor-profile";
import { listTenantVendors } from "./application/queries/list-tenant-vendors";
import { D1VendorRepository } from "./infrastructure/persistence/d1-vendor.repository";

const app = new Hono<{ Bindings: VendorBindings }>();

app.get("/health", (c) => c.json({ success: true, data: { service: "vendor-worker", status: "ok" } }));
app.post("/vendors", async (c) => {
  const body = (await c.req.json()) as {
    readonly tenantId: string;
    readonly displayName: string;
    readonly businessName: string;
  };
  const result = await registerVendor(body);
  const repository = new D1VendorRepository(c.env.TENANT_DB);
  await repository.save({
    vendor: {
      id: result.vendorId,
      displayName: body.displayName,
      businessName: body.businessName,
      status: "PENDING",
      commissionRateBasisPoints: 1200
    },
    members: []
  });
  return c.json({ success: true, data: result }, 201);
});
app.get("/vendors/:vendorId", async (c) => {
  const repository = new D1VendorRepository(c.env.TENANT_DB);
  const aggregate = await repository.getById(c.req.param("vendorId"));
  if (aggregate === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Vendor not found" } }, 404);
  }
  const result = await getVendorProfile(aggregate.vendor.id);
  return c.json({
    success: true,
    data:
      result ?? {
        vendorId: aggregate.vendor.id,
        displayName: aggregate.vendor.displayName,
        status: aggregate.vendor.status
      }
  });
});
app.post("/vendors/:vendorId/approve", async (c) => {
  const body = (await c.req.json()) as { readonly approvedBy: string };
  const result = await approveVendor({
    vendorId: c.req.param("vendorId"),
    approvedBy: body.approvedBy
  });
  return c.json({ success: true, data: result });
});
app.post("/vendors/:vendorId/suspend", async (c) => {
  const body = (await c.req.json()) as { readonly reason: string };
  const result = await suspendVendor({
    vendorId: c.req.param("vendorId"),
    reason: body.reason
  });
  return c.json({ success: true, data: result });
});
app.post("/vendors/:vendorId/payout-config", async (c) => {
  const body = (await c.req.json()) as {
    readonly payoutSchedule: "daily" | "weekly" | "biweekly" | "monthly";
    readonly minimumPayoutAmountCents: number;
  };
  const result = await configurePayout({
    vendorId: c.req.param("vendorId"),
    payoutSchedule: body.payoutSchedule,
    minimumPayoutAmountCents: body.minimumPayoutAmountCents
  });
  return c.json({ success: true, data: result });
});
app.get("/tenants/:tenantId/vendors", async (c) => {
  const result = await listTenantVendors(c.req.param("tenantId"));
  return c.json({ success: true, data: result });
});
app.get("/vendors/:vendorId/analytics", async (c) => {
  const result = await getVendorAnalytics(c.req.param("vendorId"));
  return c.json({ success: true, data: result });
});
app.get("/vendors/:vendorId/payout-history", async (c) => {
  const result = await getPayoutHistory(c.req.param("vendorId"));
  return c.json({ success: true, data: result });
});

export default app;
