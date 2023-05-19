import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [AuthModule],
  controllers: [ExchangeController],
  providers: [PrismaService, ExchangeService],
})
export class ExchangeModule {}
