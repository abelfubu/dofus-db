import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';

@Module({
  imports: [AuthModule],
  controllers: [HarvestController],
  providers: [HarvestService, PrismaService],
})
export class HarvestModule {}
