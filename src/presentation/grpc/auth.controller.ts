import { SendEmailVerificationRequestDto } from '@/application/auth/dtos/send-email-verification.dto';
import { SendEmailVerificationUseCase } from '@/application/auth/usecases/send-email-verification.usecase';
import { Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

export class AuthController {
  constructor(
    @Inject(SendEmailVerificationUseCase)
    private readonly sendEmailVerificationUseCase: SendEmailVerificationUseCase,
  ) {}

  @GrpcMethod('AuthService', 'SendVerificationCode')
  async sendEmailVerification(request: SendEmailVerificationRequestDto): Promise<void> {
    await this.sendEmailVerificationUseCase.execute(request);
  }
}
