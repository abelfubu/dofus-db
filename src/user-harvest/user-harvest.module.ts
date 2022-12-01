import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserHarvestController } from './user-harvest.controller';
import { UserHarvestService } from './user-harvest.service';

@Module({
  controllers: [UserHarvestController],
  providers: [UserHarvestService, PrismaService],
})
export class UserHarvestModule {}
