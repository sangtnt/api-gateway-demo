import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  Logger,
  LoggerService,
  ShutdownSignal,
  ValidationPipe,
} from '@nestjs/common';
import {
  CatchEverythingFilter,
  CatchValidationFilter,
  DefaultRpcExceptionFilter,
} from './shared/filters/rpc-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TimeoutInterceptor } from './shared/interceptors/time-out.interceptor';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './configs/env.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService<EnvSchema>);

  try {
    logAppEnv(logger, configService);
    configure(app, logger, configService);
    logAppPath(logger, configService);
    app.enableCors();
    await app.listen(configService.get<string>('PORT')!);
  } catch (error) {
    const stack = error instanceof Error ? error.stack : '';
    logger.error(`Error starting server, ${error}`, stack, 'Bootstrap');
    process.exit();
  }
}

function configure(
  app: INestApplication,
  logger: Logger,
  configService: ConfigService<EnvSchema>,
): void {
  const reflector = app.get(Reflector);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new CatchEverythingFilter(),
    new DefaultRpcExceptionFilter(),
    new CatchValidationFilter(),
  );
  app.useGlobalInterceptors(
    new TimeoutInterceptor(reflector, configService.get<number>('TIMEOUT')!),
  );

  app.enableShutdownHooks(
    Object.values(ShutdownSignal).filter((x) => x !== ShutdownSignal.SIGUSR2),
  );
}

function logAppPath(logger: LoggerService, configService: ConfigService<EnvSchema>): void {
  const env = configService.get<string>('NODE_ENV')!;
  const host = configService.get<string>('HOST')!;
  const port = configService.get<string>('PORT')!;

  if (env !== 'local') {
    logger.log(`Server ready at https://${host}:${port}`);
  } else {
    logger.log(`Server ready at http://${host}:${port}`);
  }
}

function logAppEnv(logger: LoggerService, configService: ConfigService<EnvSchema>): void {
  logger.log(`Environment: ${configService.get<string>('NODE_ENV')!.toUpperCase()}`);
}

void bootstrap();
