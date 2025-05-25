import { Optional } from '@nestjs/common';
import { IsString, MaxLength } from 'class-validator';

export class RegisterUserRequestDto {
  @MaxLength(255)
  emailOrPhoneNumber: string;

  @IsString()
  verificationCode!: string;

  @IsString()
  @MaxLength(50)
  password: string;

  @IsString()
  @MaxLength(255)
  @Optional()
  displayName?: string;
}
