import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateFieldDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe ser igual o mayor a 2 caracteres' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'El enlace permanente debe ser una cadena de texto' })
  @MinLength(2, { message: 'El enlace permanente debe ser igual o mayor a 2 caracteres' })
  permalink?: string;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @MinLength(1, { message: 'La ciudad debe tener al menos 1 caracter' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @MinLength(1, { message: 'El estado debe tener al menos 1 caracter' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(1, { message: 'El país debe tener al menos 1 caracter' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(1, { message: 'La dirección debe tener al menos 1 caracter' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'El mapa debe ser una cadena de texto' })
  @MinLength(1, { message: 'El mapa debe tener al menos 1 caracter' })
  map?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teamsIds?: string[];
}
