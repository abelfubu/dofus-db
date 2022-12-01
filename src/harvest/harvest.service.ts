import { Injectable } from '@nestjs/common';
import { Harvest } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HarvestService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(): Promise<Harvest[]> {
    return this.prisma.harvest.findMany();
  }
}
