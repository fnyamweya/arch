import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenantsTable = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  displayName: text("display_name").notNull(),
  status: text("status").notNull(),
  planTier: text("plan_tier").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
});
