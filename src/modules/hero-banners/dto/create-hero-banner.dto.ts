import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ALIGNMENT } from '../enums/alignment.enum.js';
import type { Alignment } from '../enums/alignment.enum.js';

export class CreateHeroBannerDto {
  @IsString({ message: '¡ El título debe ser una cadena de texto !' })
  @IsNotEmpty({ message: '¡ El título es obligatorio !' })
  @MinLength(4, { message: '¡ El título debe ser igual o mayor a 4 caracteres !' })
  title!: string;

  @IsString({ message: '¡ La descripción debe ser una cadena de texto !' })
  @IsNotEmpty({ message: '¡ La descripción es obligatoria !' })
  @MinLength(8, { message: '¡ La descripción debe ser igual o mayor a 8 caracteres !' })
  description!: string;

  @IsString({ message: '¡ El url de la imagen debe ser una cadena de texto !' })
  @IsNotEmpty({ message: '¡ El url de la imagen es obligatorio !' })
  imageUrl!: string;

  @IsString({ message: '¡ El id público de la imagen debe ser una cadena de texto !' })
  @IsNotEmpty({ message: '¡ El id público de la imagen es obligatorio !' })
  imagePublicId!: string;

  @IsOptional()
  @IsEnum(ALIGNMENT, { message: '¡ La alineación debe ser un valor válido ["left", "center", "right"] !' })
  dataAlignment?: Alignment;

  @IsOptional()
  @IsBoolean({ message: '¡ La propiedad showData debe ser del tipo boleano !' })
  showData?: boolean;

  @IsOptional()
  @IsNumber({}, { message: '¡ La posición debe ser un número !' })
  @Min(0, { message: '¡ La posición debe ser mayor o igual a 0 !' })
  position?: number;

  @IsOptional()
  @IsBoolean({ message: '¡ La propiedad activo debe ser del tipo boleano !' })
  active?: boolean;
}