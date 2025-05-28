import { IRepository } from '../base/repositories/base.repository';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository extends IRepository<UserEntity> {
  /**
   * Check if the user is available (not already registered).
   * @param user The user to check.
   * @returns A promise that resolves to true if the user is available, false otherwise.
   */
  checkExistUser(email?: string, phoneNumber?: string): Promise<boolean>;

  /**
   * Find a user by email or phone number.
   * @param email The email of the user.
   * @param phoneNumber The phone number of the user.
   * @returns A promise that resolves to the found user or null if not found.
   */
  findUser(email?: string, phoneNumber?: string): Promise<UserEntity | null>;
}
