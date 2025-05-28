import { Module } from '@nestjs/common';
import { SendEmailVerificationUseCase } from './usecases/send-email-verification.usecase';
import { KafkaModule } from '@/infra/kafka/kafka.module';
import { RedisModule } from '@/infra/redis/redis.module';
import { RegisterUserUseCase } from './usecases/register-user.usecase';
import { UserModule } from '../user/user.module';
import { AuthDbModule } from '@/infra/postgres/auth-db/auth-db.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/shared/constants/env.constant';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { TokenService } from './services/token.service';
import { LoginUseCase } from './usecases/login.usecase';

@Module({
  imports: [
    KafkaModule,
    RedisModule,
    UserModule,
    AuthDbModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>(EnvironmentVariables.JWT_SECRET);
        if (!secret?.trim()) {
          throw new RpcException({
            error: ErrorCodes.INTERNAL_SERVER_ERROR,
            code: RpcExceptionStatus.INTERNAL,
          });
        }
        return {
          secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SendEmailVerificationUseCase, RegisterUserUseCase, TokenService, LoginUseCase],
  exports: [SendEmailVerificationUseCase, RegisterUserUseCase, TokenService, LoginUseCase],
})
export class AuthModule {}
