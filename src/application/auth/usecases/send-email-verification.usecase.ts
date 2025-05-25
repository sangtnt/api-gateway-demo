import { Inject, Injectable } from '@nestjs/common';
import { SendEmailVerificationRequestDto } from '../dtos/send-email-verification.dto';
import { MAIL_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { IMailRepository } from '@/core/repositories/mail.repository';

@Injectable()
export class SendEmailVerificationUseCase {
  constructor(@Inject(MAIL_REPOSITORY_TOKEN) private readonly mailRepository: IMailRepository) {}

  async execute(request: SendEmailVerificationRequestDto): Promise<void> {
    await this.mailRepository.sendEmailVerificationCode({
      to: [request.email],
      subject: 'Email Verification Test',
      data: {
        firstName: 'Sang',
        appName: 'demoApp',
        verificationCode: '3243',
        codeExpirationMinutes: '2',
      },
    });
  }
}
