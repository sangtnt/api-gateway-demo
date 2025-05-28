import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from '@/application/user/dtos/create-user.dto';
import { CreateUserUseCase } from '@/application/user/usecases/create-users.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequestDto } from '../dtos/register-user.dto';
import { RpcException } from '@/core/exceptions/rpc.exception';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { isEmail, isPhoneNumber } from 'class-validator';
import { IVerificationCodeRepository } from '@/core/repositories/verification-code.repository';
import { VERIFICATION_CODE_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(VERIFICATION_CODE_REPOSITORY_TOKEN)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async execute(request: RegisterUserRequestDto): Promise<CreateUserResponseDto> {
    const { emailOrPhoneNumber, verificationCode } = request;

    if (!verificationCode?.trim()) {
      throw new RpcException({
        error: ErrorCodes.INVALID_VERIFICATION_CODE,
        code: RpcExceptionStatus.UNAUTHENTICATED,
      });
    }

    const existingCode = await this.verificationCodeRepository.getVerificationCode(
      emailOrPhoneNumber.trim()?.toLowerCase(),
    );

    if (!existingCode || existingCode !== verificationCode.trim()) {
      throw new RpcException({
        error: ErrorCodes.INVALID_VERIFICATION_CODE,
        code: RpcExceptionStatus.UNAUTHENTICATED,
      });
    }

    if (existingCode) {
      await this.verificationCodeRepository.deleteVerificationCode(
        emailOrPhoneNumber.trim()?.toLowerCase(),
      );
    }

    const isValidEmail = isEmail(emailOrPhoneNumber.trim());
    const isValidPhoneNumber = isPhoneNumber(emailOrPhoneNumber.trim());

    const createUserReq: CreateUserRequestDto = {
      ...request,
    };

    if (isValidEmail) {
      createUserReq.email = emailOrPhoneNumber.trim();
      createUserReq.isEmailVerified = true;
    } else if (isValidPhoneNumber) {
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
