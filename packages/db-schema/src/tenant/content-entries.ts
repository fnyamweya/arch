import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const contentEntriesTable = sqliteTable("content_entries", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  contentType: text("content_type").notNull(),
  code: text("code").notNull(),
  locale: text("locale").notNull(),
  state: text("state").notNull(),
  schema: text("schema").notNull(), // JSON
  data: text("data").notNull(), // JSON
  scheduleStart: integer("schedule_start", { mode: "timestamp_ms" }),
  scheduleEnd: integer("schedule_end", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
