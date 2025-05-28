import { IVerificationCodeRepository } from '@/core/repositories/verification-code.repository';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

export class VerificationCodeRepository implements IVerificationCodeRepository {
  constructor(@Inject(CACHE_MANAGER) private redisServiceClient: Cache) {}

  async saveVerificationCode(id: string, code: string, expMin: number): Promise<void> {
    const key = `verification_code:${id}`;
    await this.redisServiceClient.set(key, code, expMin * 60 * 1000); // Convert minutes to milliseconds
  }

  async getVerificationCode(id: string): Promise<string | null> {
    const key = `verification_code:${id}`;
    return await this.redisServiceClient.get(key);
  }

  async deleteVerificationCode(id: string): Promise<void> {
    const key = `verification_code:${id}`;
    await this.redisServiceClient.del(key);
  }
}
