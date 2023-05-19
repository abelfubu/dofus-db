import { Module } from '@nestjs/common';
import { ProfileModule } from 'src/profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { HarvestModule } from './harvest/harvest.module';
import { UserHarvestModule } from './user-harvest/user-harvest.module';

@Module({
  imports: [UserHarvestModule, HarvestModule, AuthModule, ProfileModule],
})
export class AppModule {}
