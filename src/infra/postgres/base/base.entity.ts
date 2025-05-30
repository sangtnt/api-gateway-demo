import { BaseEntity } from '@/core/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseSchema implements BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 255, nullable: true })
  createdBy?: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt?: Date;

  @Column({ name: 'updated_by', type: 'varchar', length: 255, nullable: true })
  updatedBy: string;

  @VersionColumn({ name: 'version', select: false })
  version: number;
}
