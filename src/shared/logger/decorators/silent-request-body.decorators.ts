import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { SILENT_REQUEST_BODY_METADATA } from '../utils/constrants';
import { Reflector } from '@nestjs/core';

export const SilentRequestBody = (): MethodDecorator =>
  SetMetadata(SILENT_REQUEST_BODY_METADATA, true);

export function isSilentRequestBody(reflector: Reflector, context: ExecutionContext): boolean {
  const isSilentHandler = reflector.getAllAndOverride<boolean>(SILENT_REQUEST_BODY_METADATA, [
    context.getHandler(),
    context.getClass(),
  ]);

  return isSilentHandler || false;
}
