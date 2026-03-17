export type TrackingNumber = string & { readonly __brand: "TrackingNumber" };

export const toTrackingNumber = (value: string): TrackingNumber => {
  if (value.length < 5) {
    throw new Error("tracking number must have at least 5 characters");
  }
  return value as TrackingNumber;
};
