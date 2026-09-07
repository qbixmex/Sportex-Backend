import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'contact_messages' })
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    name: 'name',
  })
  name!: string;

  @Column({
    type: 'varchar',
    name: 'email',
  })
  email!: string;

  @Column({
    type: 'text',
    name: 'message',
  })
  message!: string;

  @Column({
    type: 'boolean',
    name: 'read',
    default: false,
  })
  read?: boolean;

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