import { LoginRequestDto, LoginResponseDto } from '@/application/auth/dtos/login.dto';
import { RegisterUserRequestDto } from '@/application/auth/dtos/register-user.dto';
import {
  RenewAccessTokenRequestDto,
  RenewAccessTokenResponseDto,
} from '@/application/auth/dtos/renew-access-token.dto';
import { SendEmailVerificationRequestDto } from '@/application/auth/dtos/send-email-verification.dto';
import { VerifyAccessTokenRequestDto } from '@/application/auth/dtos/verify-access-token.dto';
import { LoginUseCase } from '@/application/auth/usecases/login.usecase';
import { RegisterUserUseCase } from '@/application/auth/usecases/register-user.usecase';
import { RenewAccessTokenUseCase } from '@/application/auth/usecases/renew-access-token.usecase';
import { SendEmailVerificationUseCase } from '@/application/auth/usecases/send-email-verification.usecase';
import { VerifyAccessTokenUseCase } from '@/application/auth/usecases/verify-access-token.usecase';
import { Timeout } from '@/shared/decorators/time-out.decorator';
import { Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export class AuthController {
  constructor(
    @Inject(SendEmailVerificationUseCase)
    private readonly sendEmailVerificationUseCase: SendEmailVerificationUseCase,
    @Inject(RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @Inject(VerifyAccessTokenUseCase)
    private readonly verifyAccessTokenUseCase: VerifyAccessTokenUseCase,
    @Inject(RenewAccessTokenUseCase)
    private readonly renewAccessTokenUseCase: RenewAccessTokenUseCase,
  ) {}

  @Timeout(10000) // 10 seconds timeout
  @GrpcMethod('AuthService', 'SendVerificationCode')
  async sendEmailVerification(request: SendEmailVerificationRequestDto): Promise<void> {
    await this.sendEmailVerificationUseCase.execute(request);
  }

  @GrpcMethod('AuthService', 'Register')
  async registerUser(request: RegisterUserRequestDto): Promise<void> {
    await this.registerUserUseCase.execute(request);
  }

  @GrpcMethod('AuthService', 'Login')
  loginUser(request: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(request);
  }

  @GrpcMethod('AuthService', 'VerifyAccessToken')
  async verifyAccessToken(request: VerifyAccessTokenRequestDto): Promise<void> {
    await this.verifyAccessTokenUseCase.execute(request.accessToken);
  }

  @GrpcMethod('AuthService', 'RefreshAccessToken')
  async refreshAccessToken(
    request: RenewAccessTokenRequestDto,
  ): Promise<RenewAccessTokenResponseDto> {
    return this.renewAccessTokenUseCase.execute(request);
  }
}
