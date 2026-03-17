export interface ShipmentEntity {
  readonly id: string;
  readonly orderId: string;
  readonly carrier: string;
  readonly trackingNumber: string;
  readonly status: string;
}
