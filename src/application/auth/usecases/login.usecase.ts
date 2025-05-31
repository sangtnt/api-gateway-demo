import { Injectable } from '@nestjs/common';
import { LoginInput, LoginOutput } from '@/shared/graphql/types.generated';

@Injectable()
export class LoginUseCase {
  async execute(request: LoginInput): Promise<LoginOutput> {
    return await Promise.resolve({
      accessToken:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLXNlcnZpY2UiLCJqdGkiOiIwMTk3MjNjNy1kYzVjLTdjOGEtOTBiZS1hMTM3ODEzMDcyZWYiLCJzdWIiOiJ1c2VyXzc1MTE3NDg1OTI5MDczNjciLCJ1c2VyIjp7ImlkIjoiZjE4ZDkwZmYtOTg4MS00MzlkLTliOGYtMDhkOTYxOWQ3YjQ3IiwiY3JlYXRlZEF0IjoiMjAyNS0wNS0zMFQwODoxNTowNy40MDhaIiwiY3JlYXRlZEJ5IjpudWxsLCJ1cGRhdGVkQXQiOiIyMDI1LTA1LTMwVDA4OjE1OjA3LjQwOFoiLCJ1cGRhdGVkQnkiOm51bGwsImVtYWlsIjoic2FuZ3RyYW5uZ3V5ZW50YW5AZ21haWwuY29tIiwiZGlzcGxheU5hbWUiOiJ1c2VyXzc1MTE3NDg1OTI5MDczNjciLCJwaG9uZU51bWJlciI6bnVsbCwidXNlck5hbWUiOiJ1c2VyXzc1MTE3NDg1OTI5MDczNjciLCJpc0FjdGl2ZSI6dHJ1ZSwiaXNFbWFpbFZlcmlmaWVkIjp0cnVlLCJpc1Bob25lTnVtYmVyVmVyaWZpZWQiOmZhbHNlfSwiaWF0IjoxNzQ4NjUxOTkwLCJleHAiOjE3NDg2NTM3OTB9.JILLyTMAZo1WkPRGdsG6bF0phd3qJjx-ak4zsDmbvdLsrvcoO-5sOllutdYkWjqTFZi1MXyfa3Vj963nHxXe8a9EdHhOM-hQJghiPn1pSM8JLNeHcawIjyQfRXfwFMud0Z-B2t0yv4sU-bpuoKcBNK2PpbdD55qlHlobE2kGwuLgyNPeBXvbXC0HgRj40RcqXjofRM6zAWzkWulH8p2aS0EwQZguysECgy7-rDq0o0_Pakvt0_iQvgI8mMoT1ASNWUHlGcLyfXWlcHZtw27gcwmbUuUL4qSCqLAgy_86Jf61XwiytVaQzUmNRvbyDhqGyCNggF8zbHohpdKmptMHkw',
      refreshToken: 'Aev21vwf5ED-ZGy7WYDqS4af0e24uAiLVe-DZc3m2-Y',
      userInfo: {
        id: 'f18d90ff-9881-439d-9b8f-08d9619d7b47',
        email: 'sangtrannguyentan@gmail.com',
        displayName: 'user_7511748592907367',
        phoneNumber: '',
        isEmailVerified: true,
        isPhoneNumberVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
        lastLoginAt: null,
        userName: 'user_7511748592907367',
      },
    });
  }
}
