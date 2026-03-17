import type { OrderAggregate } from "../aggregates/order.aggregate";

export interface OrderRepository {
  getById(orderId: string): Promise<OrderAggregate | null>;
  save(order: OrderAggregate): Promise<void>;
}
