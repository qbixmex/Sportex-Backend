import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Min } from "class-validator";

export class SearchParamsDto {
  @ApiProperty({
    description: 'El término de búsqueda',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  search_term?: string;

  @ApiProperty({
    default: 1,
    description: 'La página actual para la paginación',
    required: false,
  })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    default: 10,
    description: 'Cuantos elementos van a ser devueltos en el query',
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  take?: number;
}