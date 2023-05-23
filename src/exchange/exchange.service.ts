import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExchangeResponse } from './models/exchange.response';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async get({ id, serverId }: User): Promise<ExchangeResponse[]> {
    if (!id) throw new UnauthorizedException();

    if (!serverId) throw new BadRequestException();

    const missing = await this.prisma.harvestItem.findMany({
      where: {
        userHarvest: { user: { id } },
        AND: {
          captured: true,
        },
      },
      select: {
        harvestId: true,
      },
    });

    const exchange = await this.prisma.user.findMany({
      orderBy: {
        activeAt: 'desc',
      },
      where: {
        id: { not: id },
        serverId,
      },
      select: {
        picture: true,
        nickname: true,
        discord: true,
        server: {
          select: {
            name: true,
          },
        },
        userHarvestId: true,
        harvest: {
          select: {
            harvest: {
              select: {
                harvest: true,
              },
              where: {
                amount: { gt: 0 },
                AND: {
                  harvestId: { notIn: missing.map((x) => x.harvestId) },
                },
              },
            },
          },
        },
      },
    });

    return exchange.map((user) => ({
      picture: user.picture,
      nickname: user.nickname,
      discord: user.discord,
      userHarvestId: user.userHarvestId,
      server: user.server.name,
      harvestId: user.harvest,
      harvest: user.harvest.harvest.reduce(
        (acc, user) => {
          acc[user.harvest.type].push(user.harvest);
          return acc;
        },
        {
          0: [],
          1: [],
          2: [],
        },
      ),
    }));
  }
}
