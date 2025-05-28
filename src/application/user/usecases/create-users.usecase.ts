import { IUserRepository } from '@/core/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequestDto, CreateUserResponseDto } from '../dtos/create-user.dto';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import * as bcrypt from 'bcrypt';
import { isStrongPassword } from 'class-validator';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    this.validateCreateUserRequest(request);

    await this.processUserData(request);

    const userExist = await this.userRepository.checkExistUser(request.email, request.phoneNumber);

    if (userExist) {
      throw new RpcException({
        error: ErrorCodes.DATA_EXISTS,
        code: RpcExceptionStatus.ALREADY_EXISTS,
      });
    }

    return { id: await this.userRepository.save(request) };
  }

  private async processUserData(user: CreateUserRequestDto): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10); // Hash the password with 10 rounds
    user.email = user.email?.trim()?.toLowerCase();
    user.phoneNumber = user.phoneNumber?.trim();
    user.userName = user.userName?.trim()?.toLowerCase();
    user.displayName = user.displayName?.trim();

    if (!user.userName) {
      const random = Math.floor(Math.random() * 1000); // Random number (0–999)
      const timestamp = Date.now(); // Milliseconds since epoch
      user.userName = `user_${random}${timestamp}`;
    }

    if (!user.displayName) {
      user.displayName = user.userName;
    }
  }

  private validateCreateUserRequest(request: CreateUserRequestDto): void {
    const isValidPassword = isStrongPassword(request.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if ((!request.email && !request.phoneNumber) || !isValidPassword) {
      throw new RpcException({
        error: ErrorCodes.BAD_REQ,
        code: RpcExceptionStatus.INVALID_ARGUMENT,
      });
    }
  }
}
