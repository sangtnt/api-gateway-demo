import { Column, Entity, Index } from 'typeorm';
import { BaseSchema } from '../../base/base.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenSchema extends BaseSchema {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'token', type: 'varchar', length: 255, unique: true })
  @Index()
  token: string;

  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  @Column({
    name: 'revoked_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  revokedAt?: Date;

  @Column({ name: 'family_id', type: 'uuid' })
  familyId: string;
}
