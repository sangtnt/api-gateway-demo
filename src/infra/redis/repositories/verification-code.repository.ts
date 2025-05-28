import { VerificationCodeEntity } from '@/core/entities/verification-code.entity';
import { IVerificationCodeRepository } from '@/core/repositories/verification-code.repository';
import { VerificationCodeExpiresMinute } from '@/shared/constants/config.constants';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

export class VerificationCodeRepository implements IVerificationCodeRepository {
  constructor(@Inject(CACHE_MANAGER) private redisServiceClient: Cache) {}

  async saveVerificationCode(entity: VerificationCodeEntity): Promise<void> {
    const { id, code, expirationInMinutes, attempts } = entity;
    const exp = expirationInMinutes * 60 * 1000;
    await this.redisServiceClient.mset([
      { key: `verification_code:${id}`, value: code, ttl: exp },
      {
        key: `verification_code:remaining_attempts:${id}`,
        value: attempts.toString(),
        ttl: exp,
      },
    ]);
  }

  async updateVerificationCodeAttempts(id: string, attempts: number): Promise<void> {
    await this.redisServiceClient.set(
      `verification_code:remaining_attempts:${id}`,
      attempts.toString(),
      VerificationCodeExpiresMinute * 60 * 1000,
    );
  }

  async getVerificationCode(id: string): Promise<VerificationCodeEntity | null> {
    const [code, attempts] = await this.redisServiceClient.mget<string>([
      `verification_code:${id}`,
      `verification_code:remaining_attempts:${id}`,
    ]);

    if (code === null || attempts === null) {
      return null;
    }

    return {
      id: id,
      code: code,
      expirationInMinutes: VerificationCodeExpiresMinute,
      attempts: parseInt(attempts, 10),
    };
  }

  async deleteVerificationCode(id: string): Promise<void> {
    await this.redisServiceClient.mdel([
      `verification_code:${id}`,
      `verification_code:remaining_attempts:${id}`,
    ]);
  }
}
