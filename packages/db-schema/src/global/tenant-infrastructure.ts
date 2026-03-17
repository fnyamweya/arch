import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenantInfrastructureTable = sqliteTable("tenant_infrastructure", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().unique(),
  d1DatabaseId: text("d1_database_id").notNull(),
  kvNamespaceId: text("kv_namespace_id").notNull(),
  r2BucketName: text("r2_bucket_name").notNull(),
  queueName: text("queue_name").notNull(),
  configuredAt: integer("configured_at", { mode: "timestamp_ms" }).notNull()
});
