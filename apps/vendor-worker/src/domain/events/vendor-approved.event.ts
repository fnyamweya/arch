export interface VendorApprovedEvent {
  readonly eventName: "vendor.approved";
  readonly vendorId: string;
  readonly occurredAt: string;
}
