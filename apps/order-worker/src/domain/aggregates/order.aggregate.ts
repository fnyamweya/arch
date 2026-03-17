import type { OrderEntity } from "../entities/order.entity";
import type { OrderLineItemEntity } from "../entities/order-line-item.entity";

export interface OrderAggregate {
  readonly order: OrderEntity;
  readonly lineItems: ReadonlyArray<OrderLineItemEntity>;
}
