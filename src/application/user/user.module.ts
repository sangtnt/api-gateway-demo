import { Module } from '@nestjs/common';
import { CreateUsersUseCase } from './usecases/create-users.usecase';
import { DatabaseModule } from '@/infra/databases/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CreateUsersUseCase],
  exports: [CreateUsersUseCase],
})
export class UserModule {}
