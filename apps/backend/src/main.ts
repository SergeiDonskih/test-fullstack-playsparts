import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvKey, Environment } from './core/constants';
import { registerProcessErrorHandlers } from './config/process-error-handlers';
import { AppModule } from './app.module';

registerProcessErrorHandlers();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: configService.get<string>(
      EnvKey.FRONTEND_ORIGIN,
      'http://localhost:3000',
    ),
    credentials: true,
  });

  const nodeEnv = configService.get<Environment>(
    EnvKey.NODE_ENV,
    Environment.Development,
  );
  if (nodeEnv !== Environment.Production) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Fullstack Test API')
      .setDescription('API для тестового задания: auth/access/admin')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, swaggerDocument);
  }

  const port = configService.get<number>(EnvKey.BACKEND_PORT, 3001);
  await app.listen(port);
}

void bootstrap().catch((err: unknown) => {
  const logger = new Logger('ServerBootstrap');
  logger.error('Gateway bootstrap failed', err);
  process.exit(1);
});
