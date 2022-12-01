import { Controller, Get } from '@nestjs/common';
import { Harvest } from '@prisma/client';

import { HarvestService } from './harvest.service';

@Controller('harvest')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  getAll(): Promise<Harvest[]> {
    return this.harvestService.getAll();
  }
}
