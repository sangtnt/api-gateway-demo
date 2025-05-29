import { Module } from '@nestjs/common';
import { KafkaModule } from '@/infra/kafka/kafka.module';
import { AuthDbModule } from '@/infra/postgres/auth-db/auth-db.module';
import { RedisModule } from '@/infra/redis/redis.module';
import { EnvironmentVariables } from '@/shared/constants/env.constant';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { FindUserUseCase } from './user/usecases/find-user.usecase';
import { CreateUserUseCase } from './user/usecases/create-users.usecase';
import { TokenService } from './auth/services/token.service';
import { LoginUseCase } from './auth/usecases/login.usecase';
import { RegisterUserUseCase } from './auth/usecases/register-user.usecase';
import { SendEmailVerificationUseCase } from './auth/usecases/send-email-verification.usecase';
import { VerifyAccessTokenUseCase } from './auth/usecases/verify-access-token.usecase';

@Module({
  imports: [
    KafkaModule,
    RedisModule,
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
  providers: [
    CreateUserUseCase,
    FindUserUseCase,
    SendEmailVerificationUseCase,
    RegisterUserUseCase,
    TokenService,
    LoginUseCase,
    VerifyAccessTokenUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindUserUseCase,
    SendEmailVerificationUseCase,
    RegisterUserUseCase,
    TokenService,
    LoginUseCase,
    VerifyAccessTokenUseCase,
  ],
})
export class ApplicationModule {}
