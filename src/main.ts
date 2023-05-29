import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://dofaddicts.onrender.com',
      'https://abelfubu.github.io',
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
