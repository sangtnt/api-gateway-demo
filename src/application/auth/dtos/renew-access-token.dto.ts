import { IsString } from 'class-validator';

export class RenewAccessTokenRequestDto {
  @IsString()
  token: string;

  @IsString()
  userId: string;
}

export class RenewAccessTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}
