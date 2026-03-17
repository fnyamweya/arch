import type { ClerkConfigurationEntity } from "../../domain/entities/clerk-configuration.entity";
import type { ClerkConfigRepository } from "../../domain/repositories/clerk-config.repository";
import { clerkConfigurationsTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1ClerkConfigRepository implements ClerkConfigRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getByTenantId(tenantId: string): Promise<ClerkConfigurationEntity | null> {
    const rows = await this.db
      .select()
      .from(clerkConfigurationsTable)
      .where(eq(clerkConfigurationsTable.tenantId, tenantId))
      .limit(1);
    const row = rows[0];
    if (row === undefined) {
      return null;
    }
    return {
      id: row.id,
      tenantId: row.tenantId as string & { readonly __brand: "TenantId" },
      publishableKey: row.clerkPublishableKey,
      encryptedSecretKey: row.clerkSecretKeyEncrypted,
      webhookSecret: row.clerkWebhookSecret,
      jwksUrl: row.clerkJwksUrl
    };
  }

  public async save(configuration: ClerkConfigurationEntity): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(clerkConfigurationsTable)
      .values({
        id: configuration.id,
        tenantId: configuration.tenantId,
        clerkPublishableKey: configuration.publishableKey,
        clerkSecretKeyEncrypted: configuration.encryptedSecretKey,
        clerkWebhookSecret: configuration.webhookSecret,
        clerkJwksUrl: configuration.jwksUrl,
        configuredAt: now,
        configuredBy: "system"
      })
      .onConflictDoUpdate({
        target: clerkConfigurationsTable.tenantId,
        set: {
          clerkPublishableKey: configuration.publishableKey,
          clerkSecretKeyEncrypted: configuration.encryptedSecretKey,
          clerkWebhookSecret: configuration.webhookSecret,
          clerkJwksUrl: configuration.jwksUrl,
          configuredAt: now,
          configuredBy: "system"
        }
      });
  }
}
