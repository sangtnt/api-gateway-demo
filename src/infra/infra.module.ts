import { KAFKA_CLIENT_SERVICE } from '@/shared/constants/constants';
import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModule } from '@nestjs/microservices';
import { MailRepository } from './kafka/repositories/mail.repository';
import { kafkaConfigOptions } from '@/configs/kafka.config';
import { EnvSchema, envValidationSchema } from '@/configs/env.config';
import { redisOptions } from '@/configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      validationSchema: envValidationSchema,
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService<EnvSchema>) => {
        const logger = new Logger('Cache Module Register');
        const redisStore = redisOptions(configService);
        redisStore.on('error', (err) => {
          logger.error(`Redis connection error ${err}`);
        });
        return { stores: [redisStore] };
      },
      inject: [ConfigService<EnvSchema>],
    }),
    ClientsModule.registerAsync([
      {
        useFactory: (configService: ConfigService<EnvSchema>): ClientProvider =>
          kafkaConfigOptions(configService),
        inject: [ConfigService<EnvSchema>],
        name: KAFKA_CLIENT_SERVICE,
      },
    ]),
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
