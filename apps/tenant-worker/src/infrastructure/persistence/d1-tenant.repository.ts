import type { TenantAggregate } from "../../domain/aggregates/tenant.aggregate";
import type { TenantRepository } from "../../domain/repositories/tenant.repository";
import { clerkConfigurationsTable, tenantDomainsTable, tenantsTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1TenantRepository implements TenantRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(tenantId: string): Promise<TenantAggregate | null> {
    const tenantRows = await this.db.select().from(tenantsTable).where(eq(tenantsTable.id, tenantId)).limit(1);
    const tenant = tenantRows[0];
    if (tenant === undefined) {
      return null;
    }
    const domainRows = await this.db
      .select()
      .from(tenantDomainsTable)
      .where(eq(tenantDomainsTable.tenantId, tenant.id))
      .limit(1);
    const configRows = await this.db
      .select()
      .from(clerkConfigurationsTable)
      .where(eq(clerkConfigurationsTable.tenantId, tenant.id))
      .limit(1);
    const domain = domainRows[0];
    const config = configRows[0];
    return {
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        displayName: tenant.displayName,
        status: tenant.status
      },
      configuration: {
        tenantId: tenant.id,
        primaryDomain: domain?.domain ?? `${tenant.slug}.archcommerce.com`,
        sentryDsn: null,
        clerkPublishableKey: config?.clerkPublishableKey ?? ""
      }
    };
  }

  public async save(tenant: TenantAggregate): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(tenantsTable)
      .values({
        id: tenant.tenant.id,
        slug: tenant.tenant.slug,
        displayName: tenant.tenant.displayName,
        status: tenant.tenant.status,
        planTier: "STARTER",
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: tenantsTable.id,
        set: {
          slug: tenant.tenant.slug,
          displayName: tenant.tenant.displayName,
          status: tenant.tenant.status,
          updatedAt: now
        }
      });
    await this.db
      .insert(tenantDomainsTable)
      .values({
        id: `${tenant.tenant.id}:primary-domain`,
        tenantId: tenant.tenant.id,
        domain: tenant.configuration.primaryDomain,
        isPrimary: true,
        createdAt: now
      })
      .onConflictDoUpdate({
        target: tenantDomainsTable.id,
        set: {
          domain: tenant.configuration.primaryDomain,
          isPrimary: true
        }
      });
    await this.db
      .insert(clerkConfigurationsTable)
      .values({
        id: `${tenant.tenant.id}:clerk`,
        tenantId: tenant.tenant.id,
        clerkPublishableKey: tenant.configuration.clerkPublishableKey,
        clerkSecretKeyEncrypted: "unset",
        clerkWebhookSecret: "unset",
        clerkJwksUrl: "unset",
        configuredAt: now,
        configuredBy: "system"
      })
      .onConflictDoUpdate({
        target: clerkConfigurationsTable.tenantId,
        set: {
          clerkPublishableKey: tenant.configuration.clerkPublishableKey,
          configuredAt: now,
          configuredBy: "system"
        }
      });
  }
}
