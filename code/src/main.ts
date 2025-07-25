import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { loggerConfig } from './infra/customs/logger-level.customs';
import { LoggingInterceptor } from './infra/interceptors/logging.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig.level,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN || true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, globalTransactionId',
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
