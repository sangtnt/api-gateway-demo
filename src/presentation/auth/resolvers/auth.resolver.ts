import { LoginUseCase } from '@/application/auth/usecases/login.usecase';
import { LoginInput, LoginOutput } from '@/shared/graphql/types.generated';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  constructor(@Inject(LoginUseCase) private loginUseCase: LoginUseCase) {}

  @Mutation('login')
  async login(@Args({ name: 'input' }) input: LoginInput): Promise<LoginOutput> {
    return this.loginUseCase.execute(input);
  }

  @Query('ping')
  ping(): boolean {
    return true;
  }
}
