import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Harvest, HarvestItem, User } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import { HarvestUpdateItemDto } from './dtos/harvest-update-item.dto';
import { HarvestResponse } from './models/harvest-response';
import { MixedHarvest } from './models/mixed-harvest';
import { RefreshResponse } from './models/refresh-response';

type UserHarvestMap = Record<string, HarvestItem>;

const HARVESTLIST = { data: null };

@Injectable()
export class HarvestService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    { id, harvestId, captured, amount }: HarvestUpdateItemDto,
    user: User,
  ): Promise<void> {
    if (!user) throw new UnauthorizedException();

    const isNew = await this.prisma.harvestItem.findFirst({
      where: { harvestId: id, userHarvestId: harvestId },
    });

    if (isNew) {
      await this.prisma.harvestItem.update({
        where: { id: isNew.id },
        data: { captured, amount },
      });

      return;
    }

    await this.prisma.harvestItem.upsert({
      where: { id },
      update: {
        captured,
        amount,
      },
      create: {
        userHarvestId: harvestId,
        harvestId: id,
        captured,
        amount,
      },
    });
  }

  async getAll(user: User): Promise<HarvestResponse> {
    if (!HARVESTLIST.data) {
      HARVESTLIST.data = await this.prisma.harvest.findMany();
    }

    if (!user.id)
      return {
        harvest: HARVESTLIST.data,
        harvestId: null,
        user: { ...user, server: null },
      };

    const userHarvest = await this.prisma.userHarvest.findUnique({
      where: { id: user.userHarvestId },
      include: {
        harvest: true,
        user: { select: { server: { select: { name: true } } } },
      },
    });

    const userInfo = {
      nickname: user.nickname,
      discord: user.discord,
      server: userHarvest.user.server.name,
    };

    if (!userHarvest.harvest.length)
      return {
        harvest: HARVESTLIST.data,
        harvestId: user.userHarvestId,
        user: userInfo,
      };

    const userHarvestMap = this.getUserHarvestToMap(userHarvest.harvest);

    return {
      harvest: this.getUserMixedData(HARVESTLIST.data, userHarvestMap),
      harvestId: userHarvest.id,
      user: userInfo,
    };
  }

  async getHarvest(id: string): Promise<HarvestResponse> {
    if (!HARVESTLIST.data) {
      HARVESTLIST.data = await this.prisma.harvest.findMany();
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: { nickname: { equals: id, mode: 'insensitive' } },
      });

      if (user.userHarvestId) {
        id = user.userHarvestId;
      }

      const userHarvest = await this.prisma.userHarvest.findFirst({
        where: { id },
        include: {
          harvest: true,
          user: { include: { server: { select: { name: true } } } },
        },
      });

      if (!userHarvest) throw new NotFoundException();

      const userHarvestMap = this.getUserHarvestToMap(userHarvest.harvest);

      const userInfo = {
        nickname: userHarvest.user.nickname,
        discord: userHarvest.user.discord,
        server: userHarvest.user.server.name,
      };

      return {
        harvest: this.getUserMixedData(HARVESTLIST.data, userHarvestMap),
        harvestId: null,
        user: userInfo,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async completeSteps(steps: number[], user: User): Promise<HarvestResponse> {
    const { harvest } = await this.getAll(user);

    if (!harvest) throw new NotFoundException();

    const { captured, repeated } = this.getCapturedAndRepeated(harvest, steps);

    try {
      await this.prisma.harvestItem.updateMany({
        where: { id: { in: captured } },
        data: { captured: false },
      });

      await this.prisma.harvestItem.updateMany({
        where: { id: { in: repeated } },
        data: { amount: { decrement: 1 } },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return await this.getAll(user);
  }

  refresh(): RefreshResponse {
    HARVESTLIST.data = null;
    return { success: true };
  }

  private getUserMixedData(
    harvest: Harvest[],
    userHarvestMap: UserHarvestMap,
  ): MixedHarvest[] {
    return harvest.map((item) => {
      const exist = userHarvestMap[item.id];

      if (!exist) return item;

      return { ...item, ...userHarvestMap[item.id] } as any;
    });
  }

  private getUserHarvestToMap(harvest: HarvestItem[]): UserHarvestMap {
    return harvest.reduce((acc, { harvestId, id, captured, amount }) => {
      acc[harvestId] = { id, captured, amount };
      return acc;
    }, {});
  }

  private getCapturedAndRepeated(
    harvest: MixedHarvest[],
    steps: number[],
  ): { captured: string[]; repeated: string[] } {
    return harvest.reduce(
      (acc, curr) => {
        if (!steps.includes(curr.step)) return acc;

        if (curr.amount) {
          acc.repeated.push(curr.id);
          return acc;
        }

        acc.captured.push(curr.id);
        return acc;
      },
      { captured: [], repeated: [] },
    );
  }

  private getQuery(id: string): Record<string, string> {
    return !id ? { name: 'default' } : { id };
  }
}
