export interface VendorRegisteredEvent {
  readonly eventName: "vendor.registered";
  readonly vendorId: string;
  readonly occurredAt: string;
}
