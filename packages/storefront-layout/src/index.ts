import type {
  LayoutSlotDefinitionRecord,
  BlockInstanceRecord,
  BlockVersionRecord,
} from "@arch/storefront-core";
import { MAX_BLOCKS_PER_SLOT, PAGE_TYPE_BLOCK_CATEGORIES } from "@arch/storefront-core";
import type { BlockCategory, PageType } from "@arch/storefront-core";

// ─── Slot Validation ───

export interface SlotValidationError {
  readonly slotKey: string;
  readonly message: string;
  readonly code: "min_blocks" | "max_blocks" | "required_empty" | "category_mismatch" | "block_over_limit";
}

export interface SlotValidationResult {
  readonly valid: boolean;
  readonly errors: readonly SlotValidationError[];
}

/**
 * Validates that blocks placed in layout slots satisfy all constraints.
 */
export function validateSlotAssignment(
  slots: readonly LayoutSlotDefinitionRecord[],
  blocks: readonly BlockInstanceRecord[],
  blockVersions: ReadonlyMap<string, BlockVersionRecord>,
): SlotValidationResult {
  const errors: SlotValidationError[] = [];

  const blocksBySlot = new Map<string, BlockInstanceRecord[]>();
  for (const block of blocks) {
    const list = blocksBySlot.get(block.slotKey) ?? [];
    list.push(block);
    blocksBySlot.set(block.slotKey, list);
  }

  for (const slot of slots) {
    const slotBlocks = blocksBySlot.get(slot.slotKey) ?? [];

    // Required slot check
    if (slot.required && slotBlocks.length === 0) {
      errors.push({
        slotKey: slot.slotKey,
        message: `Slot "${slot.displayName}" is required but has no blocks`,
        code: "required_empty",
      });
    }

    // Min blocks check
    if (slotBlocks.length > 0 && slotBlocks.length < slot.minBlocks) {
      errors.push({
        slotKey: slot.slotKey,
        message: `Slot "${slot.displayName}" requires at least ${slot.minBlocks} blocks, got ${slotBlocks.length}`,
        code: "min_blocks",
      });
    }

    // Max blocks check
    if (slotBlocks.length > slot.maxBlocks) {
      errors.push({
        slotKey: slot.slotKey,
        message: `Slot "${slot.displayName}" allows at most ${slot.maxBlocks} blocks, got ${slotBlocks.length}`,
        code: "max_blocks",
      });
    }

    // Absolute limit
    if (slotBlocks.length > MAX_BLOCKS_PER_SLOT) {
      errors.push({
        slotKey: slot.slotKey,
        message: `Slot "${slot.displayName}" exceeds absolute limit of ${MAX_BLOCKS_PER_SLOT} blocks`,
        code: "block_over_limit",
      });
    }

    // Category compatibility
    const allowedCategories = new Set(slot.allowedBlockCategories);
    for (const block of slotBlocks) {
      const version = blockVersions.get(block.blockVersionId);
      if (!version) continue;

      // Look up the block definition's category from the version's parent
      // We check allowedSlots from the version if available
      if (version.allowedSlots.length > 0 && !version.allowedSlots.includes(slot.slotKey)) {
        errors.push({
          slotKey: slot.slotKey,
          message: `Block "${block.instanceKey}" (version ${version.version}) is not allowed in slot "${slot.slotKey}"`,
          code: "category_mismatch",
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Page Type → Block Category Validation ───

export interface PageTypeValidationResult {
  readonly valid: boolean;
  readonly disallowedBlocks: readonly {
    readonly instanceKey: string;
    readonly category: string;
    readonly reason: string;
  }[];
}

/**
 * Validates that all blocks in a page are appropriate for the page type.
 */
export function validatePageTypeBlocks(
  pageType: PageType,
  blocks: readonly BlockInstanceRecord[],
  blockVersions: ReadonlyMap<string, BlockVersionRecord>,
  blockCategories: ReadonlyMap<string, BlockCategory>,
): PageTypeValidationResult {
  const allowed = PAGE_TYPE_BLOCK_CATEGORIES[pageType];
  if (!allowed) {
    return { valid: true, disallowedBlocks: [] };
  }

  const allowedSet = new Set(allowed);
  const disallowedBlocks: { instanceKey: string; category: string; reason: string }[] = [];

  for (const block of blocks) {
    const version = blockVersions.get(block.blockVersionId);
    if (!version) continue;

    const category = blockCategories.get(version.blockDefinitionId);
    if (!category) continue;

    if (!allowedSet.has(category)) {
      disallowedBlocks.push({
        instanceKey: block.instanceKey,
        category,
        reason: `Block category "${category}" is not allowed on "${pageType}" pages`,
      });
    }
  }

  return { valid: disallowedBlocks.length === 0, disallowedBlocks };
}

// ─── Layout Schema Validation ───

export interface LayoutSchemaValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

/**
 * Validates a layout schema structure.
 * A valid layout schema must have at least one slot defined.
 */
export function validateLayoutSchema(
  schema: Record<string, unknown>,
  slots: readonly LayoutSlotDefinitionRecord[],
): LayoutSchemaValidationResult {
  const errors: string[] = [];

  if (slots.length === 0) {
    errors.push("Layout must define at least one slot");
  }

  // Check for duplicate slot keys
  const slotKeys = new Set<string>();
  for (const slot of slots) {
    if (slotKeys.has(slot.slotKey)) {
      errors.push(`Duplicate slot key: "${slot.slotKey}"`);
    }
    slotKeys.add(slot.slotKey);
  }

  // Validate min <= max for each slot
  for (const slot of slots) {
    if (slot.minBlocks > slot.maxBlocks) {
      errors.push(
        `Slot "${slot.slotKey}": minBlocks (${slot.minBlocks}) exceeds maxBlocks (${slot.maxBlocks})`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Slot Ordering ───

/**
 * Ensures blocks within a slot are sorted by sortOrder.
 */
export function sortBlocksInSlots(
  blocks: readonly BlockInstanceRecord[],
): ReadonlyMap<string, readonly BlockInstanceRecord[]> {
  const slotMap = new Map<string, BlockInstanceRecord[]>();

  for (const block of blocks) {
    const list = slotMap.get(block.slotKey) ?? [];
    list.push(block);
    slotMap.set(block.slotKey, list);
  }

  const sorted = new Map<string, readonly BlockInstanceRecord[]>();
  for (const [key, list] of slotMap) {
    sorted.set(key, [...list].sort((a, b) => a.sortOrder - b.sortOrder));
  }

  return sorted;
}
