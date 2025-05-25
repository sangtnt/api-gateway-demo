import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/databases/database.module';
import { CreateUserUseCase } from './usecases/create-users.usecase';

@Module({
  imports: [DatabaseModule],
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase],
})
export class UserModule {}
