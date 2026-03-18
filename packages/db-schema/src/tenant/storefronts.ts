import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const storefrontsTable = sqliteTable("storefronts", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  defaultLocale: text("default_locale").notNull(),
  supportedLocales: text("supported_locales").notNull(), // JSON array
  primaryDomain: text("primary_domain"),
  seoDefaults: text("seo_defaults").notNull(), // JSON
  featureFlags: text("feature_flags").notNull(), // JSON
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
