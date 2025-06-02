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
import { AppConfig } from './configs/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  try {
    logAppEnv(logger, configService);
    configure(app, configService);
    logAppPath(logger, configService);
    app.enableCors();
    await app.listen(configService.get<AppConfig>('appConfig')?.port || 8000);
  } catch (error) {
    const stack = error instanceof Error ? error.stack : '';
    logger.error(`Error starting server, ${error}`, stack, 'Bootstrap');
    process.exit();
  }
}

function configure(app: INestApplication, configService: ConfigService): void {
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new CatchEverythingFilter(),
    new DefaultRpcExceptionFilter(),
    new CatchValidationFilter(),
  );
  app.useGlobalInterceptors(
    new TimeoutInterceptor(reflector, configService.get<AppConfig>('appConfig')?.timeout || 30000),
  );

  app.enableShutdownHooks(
    Object.values(ShutdownSignal).filter((x) => x !== ShutdownSignal.SIGUSR2),
  );
}

function logAppPath(logger: LoggerService, configService: ConfigService): void {
  const host = configService.get<AppConfig>('appConfig')?.appHost || 'localhost';
  const port = configService.get<AppConfig>('appConfig')?.port;
  logger.log(`Server ready at http://${host}:${port}`);
}

function logAppEnv(logger: LoggerService, configService: ConfigService): void {
  logger.log(
    `Environment: ${configService.get<AppConfig>('appConfig')?.appEnvironment?.toUpperCase()}`,
  );
}

void bootstrap();
