import { Hono } from "hono";
import { InventoryLockDurableObject } from "./inventory-lock.durable-object";

const app = new Hono();

app.get("/health", (c) => c.json({ success: true, data: { service: "inventory-durable-object", status: "ok" } }));

export { InventoryLockDurableObject };
export default app;
