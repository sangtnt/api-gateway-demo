import { Inject, Injectable } from '@nestjs/common';
import { SendEmailVerificationRequestDto } from '../dtos/send-email-verification.dto';
import {
  MAIL_REPOSITORY_TOKEN,
  VERIFICATION_CODE_REPOSITORY_TOKEN,
} from '@/shared/constants/repository-tokens.constant';
import { IMailRepository } from '@/core/repositories/mail.repository';
import { IVerificationCodeRepository } from '@/core/repositories/verification-code.repository';
import { VerificationCodeExpiresMinute } from '@/shared/constants/config.constants';

@Injectable()
export class SendEmailVerificationUseCase {
  constructor(
    @Inject(MAIL_REPOSITORY_TOKEN) private readonly mailRepository: IMailRepository,
    @Inject(VERIFICATION_CODE_REPOSITORY_TOKEN)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async execute(request: SendEmailVerificationRequestDto): Promise<void> {
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    await this.verificationCodeRepository.saveVerificationCode(
      request.email,
      verificationCode,
      VerificationCodeExpiresMinute,
    );

    await this.mailRepository.sendEmailVerificationCode({
      to: [request.email.trim().toLowerCase()],
      subject: 'Email Verification',
      data: {
        name: request.email.split('@')[0],
        verificationCode: verificationCode,
        codeExpirationMinutes: VerificationCodeExpiresMinute,
      },
    });
  }
}
