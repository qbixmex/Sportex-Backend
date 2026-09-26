import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Correo electrónico del usuario',
    nullable: false,
    uniqueItems: true,
  })
  email!: string;

  @ApiProperty({
    example: 'your_super_difficult_password',
    description: 'Contraseña del usuario',
    nullable: false,
    uniqueItems: true,
  })
  password!: string;
}
