import { IRepository } from '../base/repositories/base.repository';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository extends IRepository<RefreshTokenEntity> {
  getTokenInfo(token: string): Promise<RefreshTokenEntity | null>;
  revokeTokenByFamily(familyId: string): Promise<void>;
}
