import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const tenantMembershipsTable = sqliteTable(
  "tenant_memberships",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").notNull(),
    globalUserId: text("global_user_id").notNull(),
    role: text("role").notNull(),
    status: text("status").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
  },
  (table) => ({
    tenantUserUnique: unique().on(table.tenantId, table.globalUserId)
  })
);
