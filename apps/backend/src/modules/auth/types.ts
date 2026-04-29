export type AuthUser = {
  userId: number;
  email: string;
  role: 'user' | 'admin';
};
