export class AuthResponseDto {
  accessToken!: string;
  user!: {
    id: number;
    email: string;
    role: 'user' | 'admin';
  };
}
