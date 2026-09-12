import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class Auth {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Correo electrónico del usuario',
    nullable: false,
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
    name: 'email',
    unique: true,
  })
  email!: string;

  @ApiProperty({
    example: 'your_super_difficult_password',
    description: 'Contraseña del usuario',
    nullable: false,
    uniqueItems: true,
  })
  @Column({
    type: 'varchar',
    name: 'password',
    select: false,
  })
  password!: string;
}
