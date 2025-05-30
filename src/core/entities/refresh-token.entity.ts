import { BaseEntity } from '@/core/entities/base.entity';

export class RefreshTokenEntity extends BaseEntity {
  userId: string;

  token: string;

  expiresAt: Date;

  revokedAt?: Date;

  familyId: string;
}
