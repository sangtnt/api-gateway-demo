import { GrpcOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { join } from 'path';

export const grpcOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['auth.v1', 'user.v1'],
    protoPath: ['auth/v1/auth.proto', 'user/v1/user.proto'],
    url: `${process.env.HOST}:${process.env.GRPC_PORT}`,
    loader: {
      keepCase: false,
      includeDirs: [join(__dirname, '../..', 'src/shared/grpc/protos/auth_service')],
    },
    keepalive: {
      keepaliveTimeMs: 10 * 1000,
      keepaliveTimeoutMs: 5 * 1000,
      keepalivePermitWithoutCalls: 1,
    },
  },
};
