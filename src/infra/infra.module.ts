import appConfig, { AppConfig } from '@/configs/app.config';
import authDatabaseConfig from '@/configs/auth-database.config';
import { EnvironmentVariables } from '@/shared/constants/env.constant';
import { createKeyv } from '@keyv/redis';
import { CacheModule, CacheOptions, CacheManagerOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_DATA_SOURCE_NAME } from '@/shared/constants/data-source-name.constant';
import { optionsFactory } from '@/shared/utils/database-factory.util';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, authDatabaseConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          ...optionsFactory(AUTH_DATA_SOURCE_NAME, configService),
          name: AUTH_DATA_SOURCE_NAME,
        };
      },
      inject: [ConfigService],
      name: AUTH_DATA_SOURCE_NAME,
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
  ],
})
export class InfraModule {}
