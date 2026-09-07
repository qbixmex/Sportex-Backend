import type { Relation } from 'typeorm';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { formatPermalinkOrSlug } from '../../../utils/format_permalink.util.js';
import { CustomPageImage } from '../../custom-page-images/entities/custom-page-image.entity.js';
import type { PageStatus } from '../enums/page-status.enum.js';
import { PAGE_STATUS } from '../enums/page-status.enum.js';
import { SEO_ROBOTS } from '../enums/seo-robots.enum.js';
import type { SeoRobots } from '../enums/seo-robots.enum.js';

@Entity({ name: 'custom_pages' })
export class CustomPage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'title',
  })
  title!: string;

  @Column({
    type: 'varchar',
    name: 'permalink',
    unique: true,
  })
  permalink!: string;

  @Column({
    type: 'text',
    name: 'content',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'int',
    name: 'position',
    default: 0,
  })
  position?: number;

  @Column({
    type: 'varchar',
    name: 'seo_title',
    nullable: true,
    length: 80,
  })
  seoTitle?: string;

  @Column({
    type: 'varchar',
    name: 'seo_description',
    nullable: true,
    length: 170,
  })
  seoDescription?: string;

  @Column({
    type: 'varchar',
    name: 'seo_robots',
    default: SEO_ROBOTS.NOINDEX_NOFOLLOW,
  })
  seoRobots?: SeoRobots;

  @Column({
    type: 'enum',
    enum: PAGE_STATUS,
    name: 'status',
    default: PAGE_STATUS.DRAFT,
  })
  status!: PageStatus;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Date;

  @OneToMany(
    () => CustomPageImage,
    (customPageImage) => customPageImage.parentPage,
  )
  images?: Relation<CustomPageImage[]>;

  @BeforeInsert()
  transformPermalinkInsert() {
    this.permalink = formatPermalinkOrSlug(this.permalink ?? this.title);
  }

  @BeforeUpdate()
  transformPermalinkUpdate() {
    this.permalink = formatPermalinkOrSlug(this.permalink ?? this.title);
  }
}