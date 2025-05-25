import { MailEntity } from '@/core/entities/mail.entity';
import { IMailRepository } from '@/core/repositories/mail.repository';
import { EnvironmentVariables } from '@/shared/constants/env.constant';
import { Logger } from '@/shared/logger/services/app-logger.service';
import { Inject, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class MailRepository implements OnModuleInit, OnApplicationShutdown, IMailRepository {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private logger: Logger,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.kafkaClient.connect();
      this.logger.log('Kafka Producer client connected successfully.');
    } catch (error) {
      this.logger.error(`Failed to connect Kafka Producer client: ${JSON.stringify(error)}`);
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.kafkaClient.close();
    this.logger.log('Kafka Producer client closed.');
  }

  async sendEmailVerificationCode(req: MailEntity): Promise<void> {
    this.logger.log(`Sending message to Kafka topic email-verification`);
    await lastValueFrom(
      this.kafkaClient.emit(
        this.configService.get<string>(EnvironmentVariables.KAFKA_NOTI_EMAIL_VERIFICATION_TOPIC),
        {
          value: {
            ...req,
            dynamicTemplateData: {
              ...req.data,
            },
            templateId: this.configService.get<string>(
              EnvironmentVariables.KAFKA_NOTI_EMAIL_VERIFICATION_TEMPLATE_ID,
            ),
          },
        },
      ),
    );
    this.logger.log(`Message sent to Kafka topic email-verification`);
  }
}
