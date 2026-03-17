export interface UserProfileView {
  readonly userId: string;
  readonly email: string | null;
}

export const getUserProfile = async (userId: string): Promise<UserProfileView | null> => {
  void userId;
  return null;
};
