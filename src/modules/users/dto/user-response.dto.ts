import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto.js';

export class UserResponseDto {
  @ApiProperty({
    type: UserDto,
    description: 'Datos del usuario',
  })
  user!: UserDto;
}