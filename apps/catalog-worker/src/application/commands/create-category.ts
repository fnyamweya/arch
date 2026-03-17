export interface CreateCategoryCommand {
  readonly name: string;
  readonly slug: string;
  readonly parentCategoryId: string | null;
}

export const createCategory = async (
  command: CreateCategoryCommand
): Promise<{ readonly categoryId: string }> => {
  return { categoryId: `cat:${command.slug}` };
};
