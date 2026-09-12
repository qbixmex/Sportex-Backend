import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto.js';

export class UserUpdateResponseDto {
  @ApiProperty({
    example: 'Usuario actualizado exitosamente',
    description: 'Mensaje de la respuesta',
  })
  message!: string;

  @ApiProperty({
    type: UserDto,
    description: 'Datos del usuario',
  })
  user!: UserDto;
}