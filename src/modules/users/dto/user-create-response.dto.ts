import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto.js';

export class UserCreateResponseDto {
  @ApiProperty({
    example: 'Usuario creado satisfactoriamente',
    description: 'Mensaje de la respuesta',
  })
  message!: string;

  @ApiProperty({
    type: UserDto,
    description: 'Datos del usuario',
  })
  user!: UserDto;
}