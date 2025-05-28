import { RpcException } from '@/core/exceptions/rpc.exception';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { ErrorCodes } from '../constants/rp-exception.constant';
import { status as RpcExceptionStatus } from '@grpc/grpc-js';
import { Reflector } from '@nestjs/core';
import { TIMEOUT_KEY } from '../decorators/time-out.decorator';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly timeout: number,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const handler = context.getHandler();
    const classRef = context.getClass();

    // Check for timeout metadata on the handler, then on the controller
    const specificTimeout =
      this.reflector.get<number>(TIMEOUT_KEY, handler) ||
      this.reflector.get<number>(TIMEOUT_KEY, classRef);

    const timeoutDuration = specificTimeout || this.timeout;

    return next.handle().pipe(
      timeout(timeoutDuration),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RpcException({
            error: ErrorCodes.TIME_OUT,
            code: RpcExceptionStatus.CANCELLED,
          });
        }
        throw err;
      }),
    );
  }
}
