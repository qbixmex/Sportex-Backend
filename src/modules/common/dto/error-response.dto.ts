import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'Código de estado HTTP de la respuesta',
  })
  statusCode!: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    description:
      'Mensaje (o lista de mensajes) que describe el error ocurrido. Su contenido es propio de cada caso',
  })
  message!: string | string[];

  @ApiProperty({
    example: 'Bad Request',
    description: 'Nombre estándar del error HTTP',
    required: false,
  })
  error?: string;
}