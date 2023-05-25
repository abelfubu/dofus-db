import { LoginProvider } from './login-provider';

export interface JwtPayload {
  email: string;
  picture?: string;
  nickname: string;
  provider: LoginProvider;
}
