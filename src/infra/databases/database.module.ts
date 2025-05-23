import { authDatabaseConfigOptions } from '@/configs/auth-database.config';
import { AUTH_DATA_SOURCE_NAME } from '@/shared/constants/data-source-name.constant';
import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { optionsFactory } from '@/shared/utils/database-factory.util';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserSchema } from './typeorm/auth-db/entities/user.entity';
import { UserRepository } from './typeorm/auth-db/repositories/user.repository';

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
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: (configService: ConfigService): Promise<DataSource> => {
        const dataSource = new DataSource(authDatabaseConfigOptions(configService));

        return dataSource.initialize();
      },
      inject: [ConfigService],
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useFactory: (dataSource: DataSource): UserRepository =>
        new UserRepository(dataSource.getRepository(UserSchema)),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class DatabaseModule {}
