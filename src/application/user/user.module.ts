import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './usecases/create-users.usecase';
import { AuthDbModule } from '@/infra/postgres/auth-db/auth-db.module';

@Module({
  imports: [AuthDbModule],
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase],
})
export class UserModule {}
