import { FindUserUseCase } from '@/application/user/usecases/find-user.usecase';
import { LoginRequestDto, LoginResponseDto } from '../dtos/login.dto';
import { TokenService } from '../services/token.service';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { IUserRepository } from '@/core/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private findUserUseCase: FindUserUseCase,
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const foundUser = await this.findUserUseCase.execute(request.emailOrPhoneNumber);

    if (!foundUser) {
      throw new RpcException({
        error: ErrorCodes.UNAUTHENTICATED,
        code: RpcExceptionStatus.UNAUTHENTICATED,
      });
    }

    const isPasswordValid = await bcrypt.compare(request.password, foundUser.password);

    if (!isPasswordValid) {
      throw new RpcException({
        error: ErrorCodes.UNAUTHENTICATED,
        code: RpcExceptionStatus.UNAUTHENTICATED,
      });
    }

    const refreshToken = await this.tokenService.generateRefreshToken(foundUser);

    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save({
      ...foundUser,
      currentHashedRefreshToken,
      lastLoginAt: new Date(),
    });

    return {
      accessToken: await this.tokenService.generateAccessToken(foundUser),
      refreshToken,
      userInfo: foundUser,
    };
  }
}
