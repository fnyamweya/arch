export type Sku = string & { readonly __brand: "Sku" };

export const toSku = (value: string): Sku => {
  if (value.length < 3) {
    throw new Error("sku must have at least 3 characters");
  }
  return value as Sku;
};
