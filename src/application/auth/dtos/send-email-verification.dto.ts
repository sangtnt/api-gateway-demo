import { IsEmail, IsString } from 'class-validator';

export class SendEmailVerificationRequestDto {
  @IsString()
  @IsEmail()
  email: string;
}
