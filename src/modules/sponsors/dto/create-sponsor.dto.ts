import {
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class CreateSponsorDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe ser igual o mayor a 3 caracteres' })
  name!: string;

  @IsString({ message: 'El url debe ser una cadena de texto' })
  @IsOptional()
  url?: string;

  @IsString({ message: 'El url de la imagen debe ser una cadena de texto' })
  @IsOptional()
  imageUrl?: string;

  @IsString({ message: 'El id público de la imagen debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(1, { message: 'El id público debe ser mínimo de 1 caracter' })
  imagePublicId?: string;

  @IsNumber({}, { message: 'La posición debe ser un número' })
  @IsOptional()
  @Min(0, { message: 'La posición debe ser mayor o igual a 0' })
  position?: number;

  @IsNumber({}, { message: 'Los clicks deben ser un número' })
  @IsOptional()
  @Min(0, { message: 'Los clicks deben ser mayor o igual a 0' })
  clicks?: number;

  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  @IsOptional()
  active?: boolean;
}
