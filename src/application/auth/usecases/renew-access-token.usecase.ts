import { IRefreshTokenRepository } from '@/core/repositories/refresh-token.repository';
import { REFRESH_TOKEN_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { Logger } from '@/shared/logger/services/app-logger.service';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { FindUserUseCase } from '@/application/user/usecases/find-user.usecase';
import { RefreshTokenExpiresMinute } from '@/shared/constants/config.constants';
import {
  RenewAccessTokenRequestDto,
  RenewAccessTokenResponseDto,
} from '../dtos/renew-access-token.dto';

@Injectable()
export class RenewAccessTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly rfTokenRepository: IRefreshTokenRepository,
    private readonly logger: Logger,
    private findUserUseCase: FindUserUseCase,
  ) {}

  async execute(request: RenewAccessTokenRequestDto): Promise<RenewAccessTokenResponseDto> {
    const existingToken = await this.rfTokenRepository.getTokenInfo(
      this.tokenService.hashToken(request.token),
    );
    if (!existingToken) {
      this.logger.error(`Refresh token not found: ${request.token}`);
      throw new RpcException({
        error: ErrorCodes.INVALID_TOKEN,
        code: RpcExceptionStatus.INTERNAL,
      });
    }

    if (existingToken.revokedAt || existingToken.userId !== request.userId) {
      this.logger.error(`Refresh token revoked: ${existingToken.token}`);
      await this.rfTokenRepository.revokeTokenByFamily(existingToken.familyId);
      throw new RpcException({
        error: ErrorCodes.INVALID_TOKEN,
        code: RpcExceptionStatus.INTERNAL,
      });
    }

    // Revoke the existing refresh token
    existingToken.revokedAt = new Date();
    await this.rfTokenRepository.save(existingToken);

    if (existingToken.expiresAt.getTime() < new Date().getTime()) {
      this.logger.error(`Refresh token expired: ${existingToken.token}`);
      throw new RpcException({
        error: ErrorCodes.TOKEN_EXPIRED,
        code: RpcExceptionStatus.UNAUTHENTICATED,
      });
    }

    // Find the user associated with the refresh token
    const foundUser = await this.findUserUseCase.execute(existingToken.userId);

    if (!foundUser) {
      this.logger.error(`User not found for refresh token: ${existingToken.token}`);
      throw new RpcException({
        error: ErrorCodes.DATA_NOT_FOUND,
        code: RpcExceptionStatus.NOT_FOUND,
      });
    }

    // Generate a new access token for the user
    const newAccessToken = await this.tokenService.generateAccessToken(foundUser);
    const newRefreshToken = this.tokenService.generateRefreshToken();

    // Generate a new refresh token
    await this.rfTokenRepository.save({
      userId: foundUser.id,
      token: this.tokenService.hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + RefreshTokenExpiresMinute),
      familyId: existingToken.familyId, // Reuse the same family ID
    });
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
