import { UserEntity } from '@/core/entities/user.entity';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  emailOrPhoneNumber: string;

  @IsString()
  password: string;
}

export class LoginResponseDto {
  refreshToken: string;
  accessToken: string;
  userInfo: UserEntity;
}
