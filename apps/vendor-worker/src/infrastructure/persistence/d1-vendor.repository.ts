import type { VendorAggregate } from "../../domain/aggregates/vendor.aggregate";
import type { VendorRepository } from "../../domain/repositories/vendor.repository";
import { vendorMembersTable, vendorsTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1VendorRepository implements VendorRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(vendorId: string): Promise<VendorAggregate | null> {
    const vendorRows = await this.db.select().from(vendorsTable).where(eq(vendorsTable.id, vendorId)).limit(1);
    const vendor = vendorRows[0];
    if (vendor === undefined) {
      return null;
    }
    const memberRows = await this.db.select().from(vendorMembersTable).where(eq(vendorMembersTable.vendorId, vendorId));
    return {
      vendor: {
        id: vendor.id,
        displayName: vendor.displayName,
        businessName: vendor.businessName,
        status: vendor.status,
        commissionRateBasisPoints: vendor.commissionRateBasisPoints
      },
      members: memberRows.map((member) => ({
        id: member.id,
        vendorId: member.vendorId,
        globalUserId: member.globalUserId,
        role: member.role,
        status: member.status
      }))
    };
  }

  public async save(vendor: VendorAggregate): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(vendorsTable)
      .values({
        id: vendor.vendor.id,
        displayName: vendor.vendor.displayName,
        businessName: vendor.vendor.businessName,
        status: vendor.vendor.status,
        commissionRateBasisPoints: vendor.vendor.commissionRateBasisPoints,
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: vendorsTable.id,
        set: {
          displayName: vendor.vendor.displayName,
          businessName: vendor.vendor.businessName,
          status: vendor.vendor.status,
          commissionRateBasisPoints: vendor.vendor.commissionRateBasisPoints,
          updatedAt: now
        }
      });
    for (const member of vendor.members) {
      await this.db
        .insert(vendorMembersTable)
        .values({
          id: member.id,
          vendorId: member.vendorId,
          globalUserId: member.globalUserId,
          role: member.role,
          status: member.status,
          createdAt: now,
          updatedAt: now
        })
        .onConflictDoUpdate({
          target: vendorMembersTable.id,
          set: {
            role: member.role,
            status: member.status,
            updatedAt: now
          }
        });
    }
  }
}
