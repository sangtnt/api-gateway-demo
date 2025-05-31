import { Module } from '@nestjs/common';
import { LoginUseCase } from './auth/usecases/login.usecase';
import { InfraModule } from '@/infra/infra.module';

@Module({
  imports: [InfraModule],
  providers: [LoginUseCase],
  exports: [LoginUseCase],
})
export class ApplicationModule {}
