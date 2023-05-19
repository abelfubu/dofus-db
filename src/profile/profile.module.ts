import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { ProfileController } from 'src/profile/profile.controller';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [PrismaService, ProfileService],
})
export class ProfileModule {}
