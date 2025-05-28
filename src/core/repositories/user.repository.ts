import { IRepository } from '../base/repositories/base.repository';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository extends IRepository<UserEntity> {
  /**
   * Check if the user is available (not already registered).
   * @param user The user to check.
   * @returns A promise that resolves to true if the user is available, false otherwise.
   */
  checkExistUser(email?: string, phoneNumber?: string): Promise<boolean>;
}
