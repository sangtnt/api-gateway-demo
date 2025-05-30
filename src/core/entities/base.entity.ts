import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
  id: string;

  createdAt: Date;

  createdBy?: string;

  updatedAt?: Date;

  updatedBy: string;

  @Exclude()
  version: number;
}
