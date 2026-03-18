import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const publishJobsTable = sqliteTable("publish_jobs", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  sourceVersion: text("source_version").notNull(),
  targetVersion: text("target_version").notNull(),
  status: text("status").notNull(),
  validationReport: text("validation_report").notNull(), // JSON
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
});
