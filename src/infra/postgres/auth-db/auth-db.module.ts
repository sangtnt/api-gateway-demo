import { USER_REPOSITORY_TOKEN } from '@/shared/constants/repository-tokens.constant';
import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { DataSource } from 'typeorm';
import { UserSchema } from './entities/user.entity';
import { authDatabaseConfigOptions } from '@/configs/auth-database.config';
import { ConfigService } from '@nestjs/config';

@Module({
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
export class AuthDbModule {}
