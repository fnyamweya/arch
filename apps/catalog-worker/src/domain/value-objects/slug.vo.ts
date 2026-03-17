export type Slug = string & { readonly __brand: "Slug" };

export const toSlug = (value: string): Slug => {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error("slug must be lowercase alphanumeric and dashes");
  }
  return value as Slug;
};
