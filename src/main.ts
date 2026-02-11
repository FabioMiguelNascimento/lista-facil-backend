import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import "dotenv/config";
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT!
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ZodValidationPipe());

  app.use(cookieParser());
  
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(PORT);
}
bootstrap();