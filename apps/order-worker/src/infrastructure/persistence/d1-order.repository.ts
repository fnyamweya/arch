import type { OrderAggregate } from "../../domain/aggregates/order.aggregate";
import type { OrderRepository } from "../../domain/repositories/order.repository";
import { orderItemsTable, ordersTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1OrderRepository implements OrderRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(orderId: string): Promise<OrderAggregate | null> {
    const orderRows = await this.db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
    const order = orderRows[0];
    if (order === undefined) {
      return null;
    }
    const itemRows = await this.db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
    return {
      order: {
        id: order.id,
        customerId: order.customerId,
        status: order.status,
        totalAmountCents: order.totalAmountCents,
        currencyCode: order.currencyCode
      },
      lineItems: itemRows.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceAmountCents: item.unitPriceAmountCents,
        lineTotalAmountCents: item.lineTotalAmountCents
      }))
    };
  }

  public async save(order: OrderAggregate): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(ordersTable)
      .values({
        id: order.order.id,
        orderNumber: order.order.id,
        customerId: order.order.customerId,
        status: order.order.status,
        totalAmountCents: order.order.totalAmountCents,
        currencyCode: order.order.currencyCode,
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: ordersTable.id,
        set: {
          status: order.order.status,
          totalAmountCents: order.order.totalAmountCents,
          currencyCode: order.order.currencyCode,
          updatedAt: now
        }
      });
    for (const lineItem of order.lineItems) {
      await this.db
        .insert(orderItemsTable)
        .values({
          id: lineItem.id,
          orderId: lineItem.orderId,
          productId: lineItem.productId,
          variantId: null,
          quantity: lineItem.quantity,
          unitPriceAmountCents: lineItem.unitPriceAmountCents,
          lineTotalAmountCents: lineItem.lineTotalAmountCents,
          currencyCode: order.order.currencyCode
        })
        .onConflictDoUpdate({
          target: orderItemsTable.id,
          set: {
            quantity: lineItem.quantity,
            unitPriceAmountCents: lineItem.unitPriceAmountCents,
            lineTotalAmountCents: lineItem.lineTotalAmountCents
          }
        });
    }
  }
}
