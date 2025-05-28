import { IsString } from 'class-validator';

export class VerifyAccessTokenRequestDto {
  @IsString()
  accessToken: string;
}
