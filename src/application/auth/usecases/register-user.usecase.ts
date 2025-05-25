import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from '@/application/user/dtos/create-user.dto';
import { CreateUserUseCase } from '@/application/user/usecases/create-users.usecase';
import { Injectable } from '@nestjs/common';
import { RegisterUserRequestDto } from '../dtos/register-user.dto';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { isEmail, isPhoneNumber } from 'class-validator';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async execute(request: RegisterUserRequestDto): Promise<CreateUserResponseDto> {
    const { emailOrPhoneNumber, verificationCode } = request;

    if (!verificationCode) {
      throw new RpcException({
        error: ErrorCodes.INVALID_VERIFICATION_CODE,
        code: RpcExceptionStatus.UNAUTHENTICATED,
      });
    }

    const createUserReq: CreateUserRequestDto = {
      ...request,
    };

    if (isEmail(emailOrPhoneNumber.trim())) {
      createUserReq.email = emailOrPhoneNumber.trim();
      createUserReq.isEmailVerified = true;
    } else if (isPhoneNumber(emailOrPhoneNumber.trim())) {
      createUserReq.phoneNumber = emailOrPhoneNumber.trim();
      createUserReq.isPhoneNumberVerified = true;
    } else {
      throw new RpcException({
        error: ErrorCodes.BAD_REQ,
        code: RpcExceptionStatus.INVALID_ARGUMENT,
      });
    }

    return await this.createUserUseCase.execute(createUserReq);
  }
}
