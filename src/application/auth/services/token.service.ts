import { JwtService } from '@nestjs/jwt';
import { uuidv7 } from 'uuidv7';
import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@/core/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import {
  AccessTokenExpiresMinute,
  RefreshTokenExpiresMinute,
} from '@/shared/constants/config.constants';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/shared/constants/env.constant';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}
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

  async verifyAccessToken(token: string): Promise<void> {
    await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(EnvironmentVariables.JWT_SECRET),
    });
  }
}
