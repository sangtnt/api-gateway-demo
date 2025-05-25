import { Module } from '@nestjs/common';
import { SendEmailVerificationUseCase } from './usecases/send-email-verification.usecase';
import { KafkaModule } from '@/infra/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [SendEmailVerificationUseCase],
  exports: [SendEmailVerificationUseCase],
})
export class AuthModule {}
