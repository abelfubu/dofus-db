import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly service: ExchangeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  get(@GetUser() user: User) {
    return this.service.get(user);
  }
}
