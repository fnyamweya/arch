import type { VendorMemberEntity } from "../entities/vendor-member.entity";
import type { VendorEntity } from "../entities/vendor.entity";

export interface VendorAggregate {
  readonly vendor: VendorEntity;
  readonly members: ReadonlyArray<VendorMemberEntity>;
}
