import { ALIGNMENT } from '../enums/alignment.enum.js';
import type { Alignment } from '../enums/alignment.enum.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'hero_banners' })
export class HeroBanner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'title',
    unique: true,
  })
  title!: string;

  @Column({
    type: 'varchar',
    name: 'description',
  })
  description!: string;

  @Column({
    type: 'varchar',
    name: 'image_url',
  })
  imageUrl!: string;

  @Column({
    type: 'varchar',
    name: 'image_public_id',
  })
  imagePublicId!: string;

  @Column({
    type: 'enum',
    enum: ALIGNMENT,
    name: 'data_alignment',
    default: ALIGNMENT.LEFT,
  })
  dataAlignment!: Alignment;

  @Column({
    type: 'boolean',
    name: 'show_data',
    default: false,
  })
  showData: boolean = false;

  @Column({
    type: 'int',
    name: 'position',
    default: 0,
  })
  position: number = 0;

  @Column({
    type: 'boolean',
    name: 'active',
    default: false,
  })
  active!: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Date;
}
