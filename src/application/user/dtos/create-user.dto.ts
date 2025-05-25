import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsOptional()
  @MaxLength(255)
  userName?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @IsString()
  @MaxLength(50)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  displayName?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @MaxLength(255)
  @IsOptional()
  createdBy?: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isPhoneNumberVerified?: boolean;
}

export class CreateUserResponseDto {
  id: string;
}
