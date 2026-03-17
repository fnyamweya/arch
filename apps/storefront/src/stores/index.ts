export interface StorefrontStore {
  readonly cartItemCount: number;
}

export const initialStorefrontStore: StorefrontStore = {
  cartItemCount: 0
};
