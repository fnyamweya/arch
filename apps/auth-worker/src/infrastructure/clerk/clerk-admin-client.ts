export interface CreateClerkOrganizationInput {
  readonly name: string;
  readonly slug: string;
}

export interface ClerkOrganizationResult {
  readonly id: string;
  readonly slug: string;
}

export const createClerkOrganization = async (
  input: CreateClerkOrganizationInput
): Promise<ClerkOrganizationResult> => {
  return {
    id: `org_${input.slug}`,
    slug: input.slug
  };
};
