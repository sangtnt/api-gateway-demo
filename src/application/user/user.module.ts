import { Module } from '@nestjs/common';
import { PostgresModule } from '@/infra/postgres/postgres.module';
import { CreateUserUseCase } from './usecases/create-users.usecase';

@Module({
  imports: [PostgresModule],
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase],
})
export class UserModule {}
