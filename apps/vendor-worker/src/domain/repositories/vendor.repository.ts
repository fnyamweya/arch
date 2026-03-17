import type { VendorAggregate } from "../aggregates/vendor.aggregate";

export interface VendorRepository {
  getById(vendorId: string): Promise<VendorAggregate | null>;
  save(vendor: VendorAggregate): Promise<void>;
}
