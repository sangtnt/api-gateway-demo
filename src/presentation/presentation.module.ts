/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApplicationModule } from '@/application/application.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DateTimeResolver } from 'graphql-scalars';
import { AuthResolver } from './auth/resolvers/auth.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/',
      typePaths: ['./**/*.graphql'],
      resolvers: {
        DateTime: DateTimeResolver,
      },
    }),
    ApplicationModule,
  ],
  providers: [AuthResolver],
  exports: [AuthResolver],
})
export class PresentationModule {}
