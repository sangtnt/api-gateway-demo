import { IUserRepository } from '@/core/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Inject, Injectable } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { UserEntity } from '@/core/entities/user.entity';

@Injectable()
export class FindUserUseCase {
  constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserEntity | null> {
    const isValidEmail = isEmail(id);
    const isValidPhoneNumber = isPhoneNumber(id);

    let foundUser: UserEntity | null = null;

    if (isValidEmail) {
      foundUser = await this.userRepository.findUser(id);
    } else if (isValidPhoneNumber) {
      foundUser = await this.userRepository.findUser(undefined, id);
    } else {
      foundUser = await this.userRepository.findById(id);
    }

    if (!foundUser || !foundUser.isActive) {
      return null;
    }

    return foundUser;
  }
}
