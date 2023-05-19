import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExchangeResponse } from './models/exchange.response';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User): Promise<ExchangeResponse[]> {
    if (!user.id) throw new UnauthorizedException();

    const missing = await this.prisma.harvestItem.findMany({
      where: {
        userHarvest: { user: { email: 'test@test.com' } },
        AND: {
          captured: true,
        },
      },
      select: {
        harvestId: true,
      },
    });

    const exchange = await this.prisma.user.findMany({
      where: {
        email: 'test@test.com',
      },
      select: {
        picture: true,
        nickname: true,
        discord: true,
        // email: true,
        harvest: {
          select: {
            harvest: {
              select: {
                harvest: {
                  select: { name: true },
                },
              },
              where: {
                amount: { gt: 0 },
                AND: { harvestId: { notIn: missing.map((x) => x.harvestId) } },
              },
            },
          },
        },
      },
    });

    // const abel = await this.prisma.harvestItem.findMany({
    //   where: { userHarvest: { user: { email: 'abelfubu@gmail.com' } } },
    //   select: {
    //     id: true,
    //     harvestId: true,
    //     amount: true,
    //     captured: true,
    //     harvest: {
    //       select: { name: true, id: true },
    //     },
    //   },
    // });

    // return {
    // check: abel,

    return exchange.map((user) => ({
      ...user,
      harvest: user.harvest.harvest.map((x) => x.harvest.name),
    }));
    // };
  }
}
