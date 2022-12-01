import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserHarvestService {
  constructor(private readonly prisma: PrismaService) {}

  setUserData(userHarvest: any): Promise<any> {
    return Promise.resolve(userHarvest);
  }
}
