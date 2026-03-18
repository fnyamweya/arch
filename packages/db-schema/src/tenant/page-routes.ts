import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const pageRoutesTable = sqliteTable("page_routes", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  pageDefinitionId: text("page_definition_id").notNull(),
  routeType: text("route_type").notNull(),
  pathPattern: text("path_pattern").notNull(),
  locale: text("locale").notNull(),
  status: text("status").notNull(),
  canonicalRoute: integer("canonical_route", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
