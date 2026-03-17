import { Hono } from "hono";
import { CartDurableObject } from "./cart.durable-object";

const app = new Hono();

app.get("/health", (c) => c.json({ success: true, data: { service: "cart-durable-object", status: "ok" } }));

export { CartDurableObject };
export default app;
