import { Module } from '@nestjs/common';
import { PresentationModule } from './presentation/presentation.module';
import { LoggerModule } from './shared/logger/logger.module';
import { getLoggerOptions } from './configs/logger.config';

@Module({
  imports: [LoggerModule.forRoot(getLoggerOptions()), PresentationModule],
})
export class AppModule {}
