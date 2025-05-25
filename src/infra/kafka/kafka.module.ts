import { Module } from '@nestjs/common';
import { ClientProviderOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { MailRepository } from './repositories/mail.repository';
import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/shared/constants/env.constant';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: (configService: ConfigService): ClientProviderOptions => ({
            name: 'KAFKA_SERVICE',
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
          name: 'KAFKA_SERVICE',
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
export class KafkaModule {}
