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
import { RefreshResponse } from './models/refresh-response';

type UserHarvestMap = Record<
  string,
  {
    captured: boolean;
    amount: number;
  }
>;

const HARVESTLIST = { data: null };

@Injectable()
export class HarvestService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    { id, harvestId, captured, amount }: HarvestUpdateItemDto,
    user: User,
  ): Promise<void> {
    if (!user) throw new UnauthorizedException();

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

    if (!user.id) return { harvest: HARVESTLIST.data, harvestId: null };

    const query = {
      where: { userId: user.id, ...this.getQuery(user.currentHarvestId) },
      include: { harvest: true },
    };

    const userHarvest = await this.prisma.userHarvest.findFirst(query);

    if (!userHarvest.harvest.length)
      return { harvest: HARVESTLIST.data, harvestId: userHarvest.id };

    const userHarvestMap = this.getUserHarvestToMap(userHarvest.harvest);

    return {
      harvest: this.getUserMixedData(HARVESTLIST.data, userHarvestMap),
      harvestId: userHarvest.id,
    };
  }

  async getHarvest(id: string): Promise<any> {
    try {
      const userHarvest = await this.prisma.userHarvest.findFirst({
        where: { id },
        include: { harvest: true },
      });

      if (!userHarvest) throw new NotFoundException();

      const userHarvestMap = this.getUserHarvestToMap(userHarvest.harvest);

      return {
        harvest: this.getUserMixedData(HARVESTLIST.data, userHarvestMap),
        harvestId: null,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  refresh(): RefreshResponse {
    HARVESTLIST.data = null;
    return { success: true };
  }

  private getUserMixedData(
    harvest: Harvest[],
    userHarvestMap: UserHarvestMap,
  ): Harvest[] {
    return harvest.map((item) => {
      const exist = userHarvestMap[item.id];

      if (!exist) return item;

      return { ...item, ...userHarvestMap[item.id] };
    });
  }

  private getUserHarvestToMap(harvest: HarvestItem[]): UserHarvestMap {
    return harvest.reduce((acc, { harvestId, id, captured, amount }) => {
      acc[harvestId] = { id, captured, amount };
      return acc;
    }, {});
  }

  private getQuery(id: string): Record<string, string> {
    return !id ? { name: 'default' } : { id };
  }
}
