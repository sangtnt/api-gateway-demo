import { Module } from '@nestjs/common';
import { PresentationModule } from './presentation/presentation.module';
import { LoggerModule } from './shared/logger/logger.module';
import { getLoggerOptions } from './configs/logger.config';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [LoggerModule.forRoot(getLoggerOptions()), PresentationModule, InfraModule],
})
export class AppModule {}
