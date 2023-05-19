import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ProfileUpdateDto } from 'src/profile/models/profile-update.dto';
import { PrismaService } from '../prisma.service';
import { GetProfileResponse } from './models/get-profile.response';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User): Promise<GetProfileResponse> {
    if (!user.id) throw new UnauthorizedException();

    const servers = await this.prisma.server.findMany();

    delete user.password;

    return { profile: user, servers };
  }

  async update(user: User, profileUpdateDto: ProfileUpdateDto): Promise<void> {
    if (!user.id) throw new UnauthorizedException();

    const server = await this.prisma.server.findUnique({
      where: { id: profileUpdateDto.serverId },
    });

    if (!server) throw new BadRequestException();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        discord: profileUpdateDto.discord,
        nickname: profileUpdateDto.nickname,
        serverId: profileUpdateDto.serverId,
      },
    });
  }
}
