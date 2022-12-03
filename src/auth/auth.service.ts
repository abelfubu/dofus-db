import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
import { AuthCredentialsDto } from './models/auth-credentials.dto';
import { JwtResponse } from './models/jwt-response';
import { GoogleCredentialsDto } from './models/google-credentials.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    email,
    password,
  }: AuthCredentialsDto): Promise<JwtResponse> {
    if (await this.findUser(email))
      throw new ConflictException('User already exist in the database');

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        harvest: { create: { name: 'default' } },
      },
    });

    return this.generateAccessToken(email);
  }

  async signInWithGoogle(
    googleCredentials: GoogleCredentialsDto,
  ): Promise<JwtResponse> {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    try {
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: googleCredentials.credential,
        audience: clientId,
      });

      const { email } = ticket.getPayload();

      return this.generateAccessToken(email);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async signIn({ email, password }: AuthCredentialsDto): Promise<JwtResponse> {
    const user = await this.findUser(email);

    if (!user) return this.createUser({ email, password });

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
