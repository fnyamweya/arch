import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const tenantFeatureFlagsTable = sqliteTable(
  "tenant_feature_flags",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").notNull(),
    key: text("key").notNull(),
    enabled: integer("enabled", { mode: "boolean" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
  },
  (table) => ({
    tenantKeyUnique: unique().on(table.tenantId, table.key)
  })
);
