import { MailEntity } from '@/core/entities/mail.entity';
import { IMailRepository } from '@/core/repositories/mail.repository';
import { KAFKA_CLIENT_SERVICE } from '@/shared/constants/constants';
import { EnvironmentVariables } from '@/shared/constants/env.constant';
import { Inject, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class MailRepository implements OnModuleInit, OnApplicationShutdown, IMailRepository {
  constructor(
    @Inject(KAFKA_CLIENT_SERVICE) private readonly kafkaClient: ClientKafka,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.kafkaClient.close();
  }

  async sendEmailVerificationCode(req: MailEntity): Promise<void> {
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
  }
}
