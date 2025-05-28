import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PresentationModule } from './presentation/presentation.module';
import { LoggerModule } from './shared/logger/logger.module';
import { getLoggerOptions } from './configs/logger.config';
import appConfig, { AppConfig } from './configs/app.config';
import authDatabaseConfig from './configs/auth-database.config';
import { PostgresModule } from './infra/postgres/postgres.module';
import { createKeyv } from '@keyv/redis';
import { CacheModule, CacheOptions, CacheManagerOptions } from '@nestjs/cache-manager';
import { EnvironmentVariables } from './shared/constants/env.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, authDatabaseConfig],
      cache: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService): CacheOptions<CacheManagerOptions> => {
        return {
          stores: [
            createKeyv({
              url: configService.get<string>(EnvironmentVariables.AUTH_REDIS_URL) || '',
              socket: {
                connectTimeout: configService.get<AppConfig>('appConfig')?.timeout, // 30 seconds
              },
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot(getLoggerOptions()),
    PresentationModule,
    PostgresModule,
  ],
})
export class AppModule {}
