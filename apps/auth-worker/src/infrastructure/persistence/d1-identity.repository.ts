import type { IdentityAggregate } from "../../domain/aggregates/identity.aggregate";
import type { IdentityRepository } from "../../domain/repositories/identity.repository";
import { globalUsersTable, tenantMembershipsTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1IdentityRepository implements IdentityRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getByUserId(userId: string): Promise<IdentityAggregate | null> {
    const userRows = await this.db
      .select()
      .from(globalUsersTable)
      .where(eq(globalUsersTable.id, userId))
      .limit(1);
    const user = userRows[0];
    if (user === undefined) {
      return null;
    }
    const membershipRows = await this.db
      .select()
      .from(tenantMembershipsTable)
      .where(eq(tenantMembershipsTable.globalUserId, userId));
    return {
      user: {
        id: user.id,
        clerkUserId: user.clerkUserId as string & { readonly __brand: "ClerkUserId" },
        email: (user.primaryEmail as string | null) as (string & { readonly __brand: "EmailAddress" }) | null
      },
      memberships: membershipRows.map((row) => ({
        id: row.id,
        tenantId: row.tenantId as string & { readonly __brand: "TenantId" },
        userId: row.globalUserId,
        role: row.role as
          | "PLATFORM_ADMIN"
          | "TENANT_ADMIN"
          | "VENDOR_OWNER"
          | "VENDOR_STAFF"
          | "CUSTOMER"
      }))
    };
  }

  public async save(identity: IdentityAggregate): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(globalUsersTable)
      .values({
        id: identity.user.id,
        clerkUserId: identity.user.clerkUserId,
        primaryEmail: identity.user.email,
        firstName: null,
        lastName: null,
        imageUrl: null,
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: globalUsersTable.id,
        set: {
          clerkUserId: identity.user.clerkUserId,
          primaryEmail: identity.user.email,
          updatedAt: now
        }
      });
    for (const membership of identity.memberships) {
      await this.db
        .insert(tenantMembershipsTable)
        .values({
          id: membership.id,
          tenantId: membership.tenantId,
          globalUserId: membership.userId,
          role: membership.role,
          status: "ACTIVE",
          createdAt: now,
          updatedAt: now
        })
        .onConflictDoUpdate({
          target: tenantMembershipsTable.id,
          set: {
            role: membership.role,
            status: "ACTIVE",
            updatedAt: now
          }
        });
    }
  }
}
