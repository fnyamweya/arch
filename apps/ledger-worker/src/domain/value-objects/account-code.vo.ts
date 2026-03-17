export type AccountCode = string & { readonly __brand: "AccountCode" };

export const toAccountCode = (value: string): AccountCode => {
  if (value.length < 3) {
    throw new Error("account code must have at least 3 characters");
  }
  return value as AccountCode;
};
