import { RpcException } from '@/core/exceptions/rpc.exception';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorCodes } from '@/shared/constants/rp-exception.constant';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';

export const readFile = (filePath: string): string => {
  try {
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
  } catch {
    throw new RpcException({
      error: ErrorCodes.INTERNAL_SERVER_ERROR,
      code: RpcExceptionStatus.INTERNAL,
    });
  }
};
