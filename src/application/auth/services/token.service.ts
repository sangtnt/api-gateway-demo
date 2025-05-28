import { JwtService } from '@nestjs/jwt';
import { uuidv7 } from 'uuidv7';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/core/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import {
  AccessTokenExpiresMinute,
  RefreshTokenExpiresMinute,
} from '@/shared/constants/config.constants';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  async generateAccessToken(payload: UserEntity): Promise<string> {
    return this.jwtService.signAsync(
      {
        iss: 'auth-service',
        jti: uuidv7(),
        sub: payload.userName,
        user: plainToInstance(UserEntity, payload),
      },
      {
        expiresIn: `${AccessTokenExpiresMinute}m`,
      },
    );
  }

  async generateRefreshToken(payload: UserEntity): Promise<string> {
    return this.jwtService.signAsync(
      {
        iss: 'auth-service',
        jti: uuidv7(),
        sub: payload.userName,
        displayName: payload.displayName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        emailVerified: payload.isEmailVerified,
        phoneNumberVerified: payload.isPhoneNumberVerified,
      },
      {
        expiresIn: `${RefreshTokenExpiresMinute}m`,
      },
    );
  }
}
