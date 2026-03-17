import { Hono } from "hono";
import type { OrderBindings } from "@arch/cloudflare-bindings";
import { cancelOrder } from "./application/commands/cancel-order";
import { confirmPayment } from "./application/commands/confirm-payment";
import { fulfillOrder } from "./application/commands/fulfill-order";
import { placeOrder } from "./application/commands/place-order";
import { requestRefund } from "./application/commands/request-refund";
import { getOrderDetail } from "./application/queries/get-order-detail";
import { listCustomerOrders } from "./application/queries/list-customer-orders";
import { listVendorOrders } from "./application/queries/list-vendor-orders";
import { D1OrderRepository } from "./infrastructure/persistence/d1-order.repository";

const app = new Hono<{ Bindings: OrderBindings }>();

app.get("/health", (c) => c.json({ success: true, data: { service: "order-worker", status: "ok" } }));
app.post("/orders", async (c) => {
  const body = (await c.req.json()) as {
    readonly tenantId: string;
    readonly customerId: string;
    readonly currencyCode: string;
    readonly totalAmountCents: number;
  };
  const result = await placeOrder(body);
  const repository = new D1OrderRepository(c.env.TENANT_DB);
  await repository.save({
    order: {
      id: result.orderId,
      customerId: body.customerId,
      status: "PENDING",
      totalAmountCents: body.totalAmountCents,
      currencyCode: body.currencyCode
    },
    lineItems: []
  });
  return c.json({ success: true, data: result }, 201);
});
app.get("/orders/:orderId", async (c) => {
  const repository = new D1OrderRepository(c.env.TENANT_DB);
  const aggregate = await repository.getById(c.req.param("orderId"));
  if (aggregate === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Order not found" } }, 404);
  }
  const result = await getOrderDetail(aggregate.order.id);
  return c.json({
    success: true,
    data:
      result ?? {
        orderId: aggregate.order.id,
        status: aggregate.order.status,
        totalAmountCents: aggregate.order.totalAmountCents
      }
  });
});
app.post("/orders/:orderId/confirm-payment", async (c) => {
  const body = (await c.req.json()) as { readonly paymentReference: string };
  const result = await confirmPayment({
    orderId: c.req.param("orderId"),
    paymentReference: body.paymentReference
  });
  return c.json({ success: true, data: result });
});
app.post("/orders/:orderId/fulfill", async (c) => {
  const body = (await c.req.json()) as { readonly trackingNumber: string };
  const result = await fulfillOrder({
    orderId: c.req.param("orderId"),
    trackingNumber: body.trackingNumber
  });
  return c.json({ success: true, data: result });
});
app.post("/orders/:orderId/cancel", async (c) => {
  const body = (await c.req.json()) as { readonly reason: string };
  const result = await cancelOrder({
    orderId: c.req.param("orderId"),
    reason: body.reason
  });
  return c.json({ success: true, data: result });
});
app.post("/orders/:orderId/refunds", async (c) => {
  const body = (await c.req.json()) as { readonly amountCents: number; readonly reason: string };
  const result = await requestRefund({
    orderId: c.req.param("orderId"),
    amountCents: body.amountCents,
    reason: body.reason
  });
  return c.json({ success: true, data: result }, 201);
});
app.get("/customers/:customerId/orders", async (c) => {
  const result = await listCustomerOrders(c.req.param("customerId"));
  return c.json({ success: true, data: result });
});
app.get("/vendors/:vendorId/orders", async (c) => {
  const result = await listVendorOrders(c.req.param("vendorId"));
  return c.json({ success: true, data: result });
});

export default app;
