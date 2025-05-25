import { UserSchema } from '../entities/user.entity';
import { IUserRepository } from '@/core/repositories/user.repository';
import { AbstractRepository } from '../../base/base.repository';

export class UserRepository extends AbstractRepository<UserSchema> implements IUserRepository {
  checkExistUser(email: string | undefined, phoneNumber: string | undefined): Promise<boolean> {
    const conditions: Record<string, string>[] = [];

    if (email) {
      conditions.push({ email });
    }

    if (phoneNumber) {
      conditions.push({ phoneNumber });
    }

    if (conditions.length === 0) {
      return Promise.resolve(true);
    }

    return this.repository.existsBy(conditions);
  }
}
