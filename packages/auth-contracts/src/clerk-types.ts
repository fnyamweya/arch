export interface ClerkOrganizationReference {
  readonly id: string;
  readonly slug: string | null;
  readonly name: string;
}

export interface ClerkUserReference {
  readonly id: string;
  readonly primaryEmailAddress: string | null;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly imageUrl: string | null;
}
