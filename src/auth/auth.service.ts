import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';

import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma.service';
import { AuthCredentialsDto } from './models/auth-credentials.dto';
import { GoogleCredentialsDto } from './models/google-credentials.dto';
import { JwtResponse } from './models/jwt-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    email,
    password,
    picture,
  }: {
    email: string;
    password?: string;
    picture?: string;
  }): Promise<JwtResponse> {
    await this.prisma.user.create({
      data: {
        email,
        password: password ? await this.hashPassword(password) : 'google',
        harvest: { create: { name: 'default' } },
        ...(picture && { picture }),
      },
    });

    return this.generateAccessToken(email);
  }

  async signInWithGoogle({
    credential: idToken,
  }: GoogleCredentialsDto): Promise<JwtResponse> {
    const audience = process.env.GOOGLE_CLIENT_ID;

    try {
      const client = new OAuth2Client(audience);
      const ticket = await client.verifyIdToken({ idToken, audience });
      const { email, picture } = ticket.getPayload();
      const user = await this.findUser(email);

      if (!user) return this.createUser({ email, picture });

      return this.generateAccessToken(email);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async signIn({ email, password }: AuthCredentialsDto): Promise<JwtResponse> {
    const user = await this.findUser(email);

    if (!user) return this.createUser({ email, password });

    if (user.password === 'google') {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: await this.hashPassword(password) },
      });

      return this.generateAccessToken(email);
    }

    if (!(await compare(password, user.password)))
      throw new UnauthorizedException();

    return this.generateAccessToken(email);
  }

  private generateAccessToken(email: string): JwtResponse {
    return { accessToken: this.jwtService.sign({ email }) };
  }

  private async findUser(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }
}
