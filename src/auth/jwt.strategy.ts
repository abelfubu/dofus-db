import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload } from './models/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ email }: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) throw new UnauthorizedException();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { activeAt: new Date() },
    });

    return user;
  }
}
