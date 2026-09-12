import { ApiProperty } from '@nestjs/swagger';

export class UserDeleteResponseDto {
  @ApiProperty({
    example: 'Usuario eliminado satisfactoriamente',
    description: 'Mensaje de la respuesta',
  })
  message!: string;
}