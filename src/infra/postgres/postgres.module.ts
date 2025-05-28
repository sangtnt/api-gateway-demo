import { AUTH_DATA_SOURCE_NAME } from '@/shared/constants/data-source-name.constant';
import { optionsFactory } from '@/shared/utils/database-factory.util';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          ...optionsFactory(AUTH_DATA_SOURCE_NAME, configService),
          name: AUTH_DATA_SOURCE_NAME,
        };
      },
      inject: [ConfigService],
      name: AUTH_DATA_SOURCE_NAME,
    }),
  ],
})
export class PostgresModule {}
