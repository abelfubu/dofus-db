import { Module } from '@nestjs/common';
import { HarvestModule } from './harvest/harvest.module';
import { UserHarvestModule } from './user-harvest/user-harvest.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserHarvestModule, HarvestModule, AuthModule],
})
export class AppModule {}
