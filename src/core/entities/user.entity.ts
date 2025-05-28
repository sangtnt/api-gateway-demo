import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../shared/interfaces/base.entity';

export class UserEntity extends BaseEntity {
  email?: string;

  @Exclude()
  password: string;

  displayName?: string;

  phoneNumber?: string;

  userName?: string;

  isActive: boolean;

  isEmailVerified: boolean;

  isPhoneNumberVerified: boolean;

  lastLoginAt?: Date;

  @Exclude()
  currentHashedRefreshToken?: string;
}
