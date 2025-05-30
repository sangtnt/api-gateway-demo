import { Entity, Column, Index } from 'typeorm';
import { BaseSchema } from '../../base/base.entity';
import { UserEntity } from '@/core/entities/user.entity';

@Entity({ name: 'users' })
export class UserSchema extends BaseSchema implements UserEntity {
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

  @Column({ name: 'display_name', type: 'varchar', length: 100, nullable: true })
  displayName?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
