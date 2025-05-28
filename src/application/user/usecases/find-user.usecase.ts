import { RpcException } from '@/core/exceptions/rpc.exception';
import { IUserRepository } from '@/core/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { Inject, Injectable } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { UserEntity } from '@/core/entities/user.entity';

@Injectable()
export class FindUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async execute(emailOrPhoneNumber: string): Promise<UserEntity | null> {
    const isValidEmail = isEmail(emailOrPhoneNumber);
    const isValidPhoneNumber = isPhoneNumber(emailOrPhoneNumber);

    let foundUser: UserEntity | null = null;

    if (isValidEmail) {
      foundUser = await this.userRepository.findUser(emailOrPhoneNumber);
    } else if (isValidPhoneNumber) {
      foundUser = await this.userRepository.findUser(undefined, emailOrPhoneNumber);
    } else {
      throw new RpcException({
        error: ErrorCodes.BAD_REQ,
        code: RpcExceptionStatus.INVALID_ARGUMENT,
      });
    }

    if (!foundUser || !foundUser.isActive) {
      return null;
    }

    return foundUser;
  }
}
