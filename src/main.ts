import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validation pipe for class validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //cors
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  //cookie-parser
  app.use(cookieParser());
}
void bootstrap();
