import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './usecases/create-users.usecase';
import { AuthDbModule } from '@/infra/postgres/auth-db/auth-db.module';
import { FindUserUseCase } from './usecases/find-user.usecase';

@Module({
  imports: [AuthDbModule],
  providers: [CreateUserUseCase, FindUserUseCase],
  exports: [CreateUserUseCase, FindUserUseCase],
})
export class UserModule {}
