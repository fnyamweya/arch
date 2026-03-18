import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const domainMappingsTable = sqliteTable("domain_mappings", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  hostname: text("hostname").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull(),
  redirectBehavior: text("redirect_behavior").notNull(),
  sslStatus: text("ssl_status").notNull(),
  verificationStatus: text("verification_status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
