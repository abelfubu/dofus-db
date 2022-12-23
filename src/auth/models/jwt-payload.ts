import { LoginProvider } from './login-provider';

export interface JwtPayload {
  email: string;
  picture?: string;
  provider: LoginProvider;
}
