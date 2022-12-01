import { Module } from '@nestjs/common';
import { HarvestModule } from './harvest/harvest.module';
import { UserHarvestModule } from './user-harvest/user-harvest.module';

@Module({
  imports: [UserHarvestModule, HarvestModule],
})
export class AppModule {}
