import { BaseEntity } from '../../shared/interfaces/base.entity';

export class UserEntity extends BaseEntity {
  email?: string;

  password: string;

  displayName?: string;

  phoneNumber?: string;

  isActive: boolean;

  isEmailVerified: boolean;

  lastLoginAt?: Date;

  currentHashedRefreshToken?: string;
}
