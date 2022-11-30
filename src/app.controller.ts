import { Controller, Get } from '@nestjs/common';
import { harvest } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<harvest[]> {
    return this.appService.getHello();
  }
}
