/**
 * When you run npm run start:dev node runs this file first
 * 
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Build rthe app from the root module
  const app = await NestFactory.create(AppModule);

  // 2. App-wide settings, applied to every request
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, // a request with field dto that doesn't define gets a 400
      forbidNonWhitelisted: true, // a request with field dto that doesn't define gets a 400
      transform: true }) //turns the incoming JSON into an instance of your DTO class
  );
  app.enableShutdownHooks(); // gracefully shutdown point from the kerbenetes duscussion
  // 3. Start the web servers
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
