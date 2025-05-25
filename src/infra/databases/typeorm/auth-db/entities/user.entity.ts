import { Entity, Column, Index } from 'typeorm';
import { BaseSchema } from '../../base/base.entity';

@Entity({ name: 'users' })
export class UserSchema extends BaseSchema {
  @Column({ name: 'user_name', type: 'varchar', length: 255, unique: true })
  @Index()
  userName: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true, nullable: true })
  @Index()
  email?: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, unique: true, nullable: true })
  @Index()
  phoneNumber?: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_phone_number_verified', type: 'boolean', default: false })
  isPhoneNumberVerified: boolean;

  @Column({
    name: 'hashed_password',
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  displayName?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    name: 'last_login_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastLoginAt?: Date;

  @Column({
    name: 'current_hashed_refresh_token',
    type: 'varchar',
    length: 512,
    nullable: true,
    select: false,
  })
  currentHashedRefreshToken?: string;
}
