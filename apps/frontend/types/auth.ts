export type UserRole = 'user' | 'admin';

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type CheckAccessResponse = {
  ok: true;
  user: {
    userId: number;
    email: string;
    role: UserRole;
  };
};
