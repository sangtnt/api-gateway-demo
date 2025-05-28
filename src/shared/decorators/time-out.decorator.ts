import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const TIMEOUT_KEY = 'timeout';
export const Timeout = (milliseconds: number): CustomDecorator<string> =>
  SetMetadata(TIMEOUT_KEY, milliseconds);
