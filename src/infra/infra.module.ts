import appConfig, { AppConfig } from '@/configs/app.config';
import { KAFKA_CLIENT_SERVICE } from '@/shared/constants/constants';
import { EnvironmentVariables } from '@/shared/constants/env.constant';
import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { createKeyv } from '@keyv/redis';
import { CacheModule, CacheOptions, CacheManagerOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProviderOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { MailRepository } from './kafka/repositories/mail.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      cache: true,
    }),
    CacheModule.registerAsync({
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
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (configService: ConfigService): ClientProviderOptions => ({
            name: KAFKA_CLIENT_SERVICE,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId:
                  configService.get<string>(EnvironmentVariables.KAFKA_CLIENT_ID) ||
                  'default-client-id',
                brokers: configService
                  .get<string>(EnvironmentVariables.KAFKA_BROKERS)
                  ?.split(',') || ['localhost:9092'],
              },
              consumer: {
                groupId:
                  configService.get<string>(EnvironmentVariables.KAFKA_CONSUMER_GROUP_ID) ||
                  'default-group',
              },
            },
          }),
          name: KAFKA_CLIENT_SERVICE,
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [
    {
      provide: MAIL_REPOSITORY_TOKEN,
      useClass: MailRepository,
    },
  ],
  exports: [MAIL_REPOSITORY_TOKEN],
})
export class InfraModule {}
