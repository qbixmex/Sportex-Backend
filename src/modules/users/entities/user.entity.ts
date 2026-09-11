import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'name',
    length: 200,
    nullable: true,
  })
  name?: string;

  @Column({
    type: 'varchar',
    name: 'username',
    length: 200,
    nullable: true,
    unique: true,
  })
  username?: string;

  @Column({
    type: 'varchar',
    name: 'email',
    unique: true,
  })
  email!: string;

  @Column({
    type: 'boolean',
    name: 'email_verified',
    default: false,
    nullable: true,
  })
  emailVerified?: boolean;

  @Column({
    type: 'varchar',
    name: 'image_url',
    nullable: true,
  })
  imageUrl?: string;

  @Column({
    type: 'varchar',
    name: 'image_public_id',
    nullable: true,
  })
  imagePublicId?: string;

  @Column({
    type: 'varchar',
    name: 'password',
    select: false,
  })
  password!: string;

  @Column({
    type: 'boolean',
    name: 'is_active',
    default: false,
  })
  isActive?: boolean;

  @Column({
    type: 'varchar',
    name: 'roles',
    array: true,
    default: ['user'],
  })
  roles!: string[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Date;

  @BeforeInsert()
  private checkFieldsBeforeInsert() {
    this.checkFields();
  }

  @BeforeUpdate()
  private checkFieldsBeforeUpdate() {
    this.checkFields();
  }

  private checkFields() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
    if (this.password) {
      this.password = this.password.trim();
    }
  }
}
