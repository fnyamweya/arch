import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const tenantDomainsTable = sqliteTable(
  "tenant_domains",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").notNull(),
    domain: text("domain").notNull(),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull()
  },
  (table) => ({
    tenantDomainUnique: unique().on(table.tenantId, table.domain)
  })
);
