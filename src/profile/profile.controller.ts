import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetProfileResponse } from 'src/profile/models/get-profile.response';
import { ProfileUpdateDto } from 'src/profile/models/profile-update.dto';
import { ProfileService } from 'src/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  get(@GetUser() user: User): Promise<GetProfileResponse> {
    return this.profileService.get(user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(
    @GetUser() user: User,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ): Promise<void> {
    return this.profileService.update(user, profileUpdateDto);
  }
}
