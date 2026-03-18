import type {
  BlockDefinitionRecord,
  BlockVersionRecord,
  BlockInstanceRecord,
} from "@arch/storefront-core";
import type { BlockCategory, HydrationStrategy, PageType } from "@arch/storefront-core";

// ─── Block Registry ───

export interface RegisteredBlock {
  readonly definition: BlockDefinitionRecord;
  readonly publishedVersion: BlockVersionRecord | null;
  readonly allVersions: readonly BlockVersionRecord[];
}

export class BlockRegistry {
  private readonly blocks = new Map<string, RegisteredBlock>();

  register(definition: BlockDefinitionRecord, versions: readonly BlockVersionRecord[]): void {
    const published = versions.find((v) => v.state === "published") ?? null;
    this.blocks.set(definition.code, {
      definition,
      publishedVersion: published,
      allVersions: versions,
    });
  }

  get(code: string): RegisteredBlock | undefined {
    return this.blocks.get(code);
  }

  getById(definitionId: string): RegisteredBlock | undefined {
    for (const block of this.blocks.values()) {
      if (block.definition.id === definitionId) return block;
    }
    return undefined;
  }

  listAll(): readonly RegisteredBlock[] {
    return [...this.blocks.values()];
  }

  listByCategory(category: BlockCategory): readonly RegisteredBlock[] {
    return [...this.blocks.values()].filter((b) => b.definition.category === category);
  }

  listActive(): readonly RegisteredBlock[] {
    return [...this.blocks.values()].filter((b) => b.definition.status === "active");
  }

  has(code: string): boolean {
    return this.blocks.has(code);
  }
}

// ─── Block Config Validation ───

export interface BlockConfigValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

/**
 * Validates block instance config against the block version's config schema.
 * Uses a simple structural check — real JSON Schema validation would use ajv or similar.
 */
export function validateBlockConfig(
  config: Record<string, unknown>,
  configSchema: Record<string, unknown>,
): BlockConfigValidationResult {
  const errors: string[] = [];

  // Check required fields from schema
  const required = configSchema["required"];
  if (Array.isArray(required)) {
    for (const field of required) {
      if (typeof field === "string" && !(field in config)) {
        errors.push(`Missing required config field: "${field}"`);
      }
    }
  }

  // Basic type checking for properties
  const properties = configSchema["properties"];
  if (properties && typeof properties === "object") {
    for (const [key, schemaDef] of Object.entries(properties as Record<string, unknown>)) {
      const value = config[key];
      if (value === undefined) continue;

      if (schemaDef && typeof schemaDef === "object" && "type" in schemaDef) {
        const expectedType = (schemaDef as { type: string }).type;
        const actualType = Array.isArray(value) ? "array" : typeof value;

        if (expectedType === "integer" && (typeof value !== "number" || !Number.isInteger(value))) {
          errors.push(`Config field "${key}" must be an integer`);
        } else if (expectedType !== "integer" && expectedType !== actualType) {
          errors.push(`Config field "${key}" must be of type "${expectedType}", got "${actualType}"`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Block Compatibility ───

export interface CompatibilityResult {
  readonly compatible: boolean;
  readonly reasons: readonly string[];
}

/**
 * Checks if a block version is compatible with a given page type and slot.
 */
export function checkBlockCompatibility(
  version: BlockVersionRecord,
  pageType: PageType,
  slotKey: string,
): CompatibilityResult {
  const reasons: string[] = [];

  // Check page type compatibility
  if (version.allowedPageTypes.length > 0 && !version.allowedPageTypes.includes(pageType)) {
    reasons.push(
      `Block version ${version.version} does not support page type "${pageType}"`,
    );
  }

  // Check slot compatibility
  if (version.allowedSlots.length > 0 && !version.allowedSlots.includes(slotKey)) {
    reasons.push(
      `Block version ${version.version} is not allowed in slot "${slotKey}"`,
    );
  }

  // Check deprecation
  if (version.deprecationStatus === "hard") {
    reasons.push(
      `Block version ${version.version} is hard-deprecated and cannot be used`,
    );
  }

  return { compatible: reasons.length === 0, reasons };
}

// ─── Block Version Migration ───

export interface MigrationPath {
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly strategy: Record<string, unknown>;
}

/**
 * Finds a migration path between block versions.
 */
export function findMigrationPath(
  versions: readonly BlockVersionRecord[],
  fromVersionId: string,
  toVersionId: string,
): MigrationPath | null {
  const from = versions.find((v) => v.id === fromVersionId);
  const to = versions.find((v) => v.id === toVersionId);

  if (!from || !to) return null;
  if (!to.migrationStrategy) return null;

  return {
    fromVersion: from.version,
    toVersion: to.version,
    strategy: to.migrationStrategy,
  };
}

// ─── Block Instance Sorting ───

export function sortBlockInstances(
  instances: readonly BlockInstanceRecord[],
): readonly BlockInstanceRecord[] {
  return [...instances].sort((a, b) => {
    if (a.slotKey !== b.slotKey) return a.slotKey.localeCompare(b.slotKey);
    return a.sortOrder - b.sortOrder;
  });
}

// ─── Hydration Strategy Selection ───

export interface HydrationPlan {
  readonly serverRendered: readonly string[];
  readonly clientRendered: readonly string[];
  readonly islandRendered: readonly string[];
  readonly progressiveRendered: readonly string[];
}

/**
 * Groups block instances by their hydration strategy for rendering.
 */
export function createHydrationPlan(
  instances: readonly BlockInstanceRecord[],
  versionMap: ReadonlyMap<string, BlockVersionRecord>,
): HydrationPlan {
  const serverRendered: string[] = [];
  const clientRendered: string[] = [];
  const islandRendered: string[] = [];
  const progressiveRendered: string[] = [];

  for (const instance of instances) {
    const version = versionMap.get(instance.blockVersionId);
    const strategy: HydrationStrategy = version?.hydrationStrategy ?? "server-only";

    switch (strategy) {
      case "server-only":
        serverRendered.push(instance.id);
        break;
      case "client-only":
        clientRendered.push(instance.id);
        break;
      case "island":
        islandRendered.push(instance.id);
        break;
      case "progressive":
        progressiveRendered.push(instance.id);
        break;
    }
  }

  return { serverRendered, clientRendered, islandRendered, progressiveRendered };
}
