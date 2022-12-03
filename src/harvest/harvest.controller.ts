import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HarvestUpdateItemDto } from './dtos/harvest-update-item.dto';
import { HarvestService } from './harvest.service';
import { HarvestResponse } from './models/harvest-response';

@Controller('harvest')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@GetUser() user: User): Promise<HarvestResponse> {
    return this.harvestService.getAll(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  update(
    @GetUser() user: User,
    @Body() harvestUpdateItemDto: HarvestUpdateItemDto,
  ): Promise<void> {
    return this.harvestService.update(harvestUpdateItemDto, user);
  }
}
