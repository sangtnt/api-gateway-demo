import { ApplicationModule } from '@/application/application.module';
import { Module } from '@nestjs/common';
import { AuthController } from './grpc/auth.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController],
})
export class PresentationModule {}
