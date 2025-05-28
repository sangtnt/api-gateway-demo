import { Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';

@Injectable()
export class VerifyAccessTokenUseCase {
  constructor(private readonly tokenService: TokenService) {}
  async execute(token: string): Promise<void> {
    try {
      await this.tokenService.verifyAccessToken(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new RpcException({
          error: ErrorCodes.TOKEN_EXPIRED,
          code: RpcExceptionStatus.DEADLINE_EXCEEDED,
        });
      }
      if (error instanceof JsonWebTokenError) {
        throw new RpcException({
          error: ErrorCodes.UNAUTHENTICATED,
          code: RpcExceptionStatus.UNAUTHENTICATED,
        });
      }
      throw error;
    }
  }
}
