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

  try {
    logAppEnv(logger);
    configure(app);
    logAppPath(logger);
    app.enableCors();
    await app.listen(5000);
  } catch (error) {
    const stack = error instanceof Error ? error.stack : '';
    logger.error(`Error starting server, ${error}`, stack, 'Bootstrap');
    process.exit();
  }
}

function configure(app: INestApplication): void {
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new CatchEverythingFilter(),
    new DefaultRpcExceptionFilter(),
    new CatchValidationFilter(),
  );
  app.useGlobalInterceptors(
    new TimeoutInterceptor(
      reflector,
      app.get(ConfigService).get<AppConfig>('appConfig')?.timeout || 30000,
    ),
  );

  app.enableShutdownHooks(
    Object.values(ShutdownSignal).filter((x) => x !== ShutdownSignal.SIGUSR2),
  );
}

function logAppPath(logger: LoggerService): void {
  const host = process.env.HOST || 'localhost';
  const grpcPort = process.env.GRPC_PORT || '8000';
  logger.log(`Server gRPC ready at http://${host}:${grpcPort}`);
}

function logAppEnv(logger: LoggerService): void {
  logger.log(`Environment: ${process.env['NODE_ENV']?.toUpperCase()}`);
}

void bootstrap();
