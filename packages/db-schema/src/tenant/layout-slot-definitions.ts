import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const layoutSlotDefinitionsTable = sqliteTable("layout_slot_definitions", {
  id: text("id").primaryKey(),
  layoutVersionId: text("layout_version_id").notNull(),
  slotKey: text("slot_key").notNull(),
  displayName: text("display_name").notNull(),
  allowedBlockCategories: text("allowed_block_categories").notNull(), // JSON array
  minBlocks: integer("min_blocks").notNull(),
  maxBlocks: integer("max_blocks").notNull(),
  required: integer("required", { mode: "boolean" }).notNull(),
  responsiveRules: text("responsive_rules").notNull(), // JSON
  orderingRules: text("ordering_rules").notNull(), // JSON
});
