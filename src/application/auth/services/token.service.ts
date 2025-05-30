import { JwtService } from '@nestjs/jwt';
import { uuidv7 } from 'uuidv7';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/core/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { AccessTokenExpiresMinute } from '@/shared/constants/config.constants';
import * as crypto from 'crypto';

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

  generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async verifyAccessToken(token: string): Promise<void> {
    await this.jwtService.verifyAsync(token);
  }
}
