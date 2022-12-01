import { Body, Controller, Post } from '@nestjs/common';
import { UserHarvestService } from './user-harvest.service';

@Controller('user-harvest')
export class UserHarvestController {
  constructor(private readonly userHarvestService: UserHarvestService) {}
  @Post()
  setUserData(@Body() userHarvest: any): Promise<any> {
    return this.userHarvestService.setUserData(userHarvest);
  }
}
