import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const vendorMembersTable = sqliteTable(
  "vendor_members",
  {
    id: text("id").primaryKey(),
    vendorId: text("vendor_id").notNull(),
    globalUserId: text("global_user_id").notNull(),
    role: text("role").notNull(),
    status: text("status").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
  },
  (table) => ({
    vendorMemberUnique: unique().on(table.vendorId, table.globalUserId)
  })
);
