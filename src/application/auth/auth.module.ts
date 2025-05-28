import { Module } from '@nestjs/common';
import { SendEmailVerificationUseCase } from './usecases/send-email-verification.usecase';
import { KafkaModule } from '@/infra/kafka/kafka.module';
import { RedisModule } from '@/infra/redis/redis.module';
import { RegisterUserUseCase } from './usecases/register-user.usecase';
import { UserModule } from '../user/user.module';
import { AuthDbModule } from '@/infra/postgres/auth-db/auth-db.module';

@Module({
  imports: [KafkaModule, RedisModule, UserModule, AuthDbModule],
  providers: [SendEmailVerificationUseCase, RegisterUserUseCase],
  exports: [SendEmailVerificationUseCase, RegisterUserUseCase],
})
export class AuthModule {}
