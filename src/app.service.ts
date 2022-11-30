import { Injectable } from '@nestjs/common';
import { harvest } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): Promise<harvest[]> {
    return this.prisma.harvest.findMany();
  }
}
