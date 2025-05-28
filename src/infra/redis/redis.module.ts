import { VERIFICATION_CODE_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Module } from '@nestjs/common';
import { VerificationCodeRepository } from './repositories/verification-code.repository';

@Module({
  providers: [
    {
      provide: VERIFICATION_CODE_REPOSITORY_TOKEN,
      useClass: VerificationCodeRepository,
    },
  ],
  exports: [VERIFICATION_CODE_REPOSITORY_TOKEN],
})
export class RedisModule {}
