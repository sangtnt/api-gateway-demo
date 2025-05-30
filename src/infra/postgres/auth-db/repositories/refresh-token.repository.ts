import { IRefreshTokenRepository } from '@/core/repositories/refresh-token.repository';
import { AbstractRepository } from '../../base/base.repository';
import { RefreshTokenSchema } from '../entities/refresh-token.entity';
import { RefreshTokenEntity } from '@/core/entities/refresh-token.entity';

export class RefreshTokenRepository
  extends AbstractRepository<RefreshTokenSchema>
  implements IRefreshTokenRepository
{
  getTokenInfo(token: string): Promise<RefreshTokenEntity | null> {
    return this.repository.findOne({
      where: { token },
      select: { id: true, userId: true, expiresAt: true, revokedAt: true, familyId: true },
    });
  }

  async revokeTokenByFamily(familyId: string): Promise<void> {
    await this.repository.query(
      `
        UPDATE auth_service.refresh_tokens
        SET revoked_at = NOW()
        WHERE family_id = $1    
    `,
      [familyId],
    );
  }
}
