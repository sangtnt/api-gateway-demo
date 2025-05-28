import { appConfig } from '@/shared/constants/config.constants';
import { registerAs } from '@nestjs/config';

export interface AppConfig {
  grpcPort: number;
  appHost: string;
  appEnvironment: string;
  timeout?: number;
}

export default registerAs(appConfig, () => ({
  grpcPort: parseInt(process.env.GRPC_PORT || '8000', 10),
  appHost: process.env.HOST || 'localhost',
  appEnvironment: process.env.NODE_ENV || 'development',
  timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT, 10) : undefined,
}));
