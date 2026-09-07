import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomPage } from '../../custom-pages/entities/custom-page.entity.js';

@Entity({ name: 'custom_page_images' })
export class CustomPageImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomPage, (customPage) => customPage.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_page_id' })
  parentPage!: Relation<CustomPage>;

  @Column({
    type: 'varchar',
    name: 'title',
  })
  title!: string;

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