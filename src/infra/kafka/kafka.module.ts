import { Module } from '@nestjs/common';
import { ClientProviderOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { MailRepository } from './repositories/mail.repository';
import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { ConfigService } from '@nestjs/config';

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
                clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'default-client-id',
                brokers: configService.get<string>('KAFKA_BROKERS')?.split(',') || [
                  'localhost:9092',
                ],
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
