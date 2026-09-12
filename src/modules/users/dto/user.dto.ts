import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    example: '588fdcb7-d759-495c-862e-755832fa1726',
    description: 'ID único del usuario',
  })
  id!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre del usuario',
    nullable: true,
  })
  name?: string;

  
  @ApiProperty({
    example: 'johnny',
    description: 'Nombre de usuario',
    nullable: true,
  })
  username?: string;

  @ApiProperty({
    example: 'johnny@gmail.com',
    description: 'Correo electrónico del usuario',
  })
  email!: string;

  @ApiProperty({
    example: 'johnny@gmail.com',
    description: 'Correo electrónico del usuario',
    nullable: true,
  })
  emailVerified?: boolean;

  @ApiProperty({
    example: 'https://res.cloudinary.com/jhonny/image/upload/v5839583951/users/johnny.jpg',
    description: 'Url de la imagen',
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({
    example: '45d8ae5c531378024751',
    description: 'Identificador público de la imagen',
    nullable: true,
  })
  imagePublicId?: string;

  @ApiProperty({
    examples: [true, false],
    description: 'Estado del usuario, activo ó inactivo',
    default: false,
    nullable: true,
  })
  isActive?: boolean;

  @ApiProperty({
    examples: [['user'], ['user', 'admin']],
    description: 'Roles del usuario',
    default: ['user'],
    isArray: true,
  })
  roles?: string[];

  @ApiProperty({
    example: '2025-06-15T08:22:44:15.145',
    description: 'Fecha de creación',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2025-06-18T16:48:35:12.735',
    description: 'Fecha de creación',
    nullable: true,
  })
  updatedAt!: Date;
}