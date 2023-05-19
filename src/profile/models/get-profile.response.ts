import { Server, User } from '@prisma/client';

export interface GetProfileResponse {
  profile: Omit<User, 'password'>;
  servers: Server[];
}
