import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailRepository } from './repositories/mail.repository';
import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-service-backend',
            brokers: ['localhost:9092'],
          },
        },
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
export class KafkaModule {}
