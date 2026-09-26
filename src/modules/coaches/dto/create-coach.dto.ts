import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateCoachDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe ser igual o mayor a 2 caracteres' })
  name!: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email!: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  phone?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La edad debe ser un número' })
  age?: number;

  @IsOptional()
  @IsString({ message: 'La nacionalidad debe ser una cadena de texto' })
  nationality?: string;

  @IsOptional()
  @IsString({ message: 'El url de la imagen debe ser una cadena de texto' })
  imageUrl?: string;

  @IsOptional()
  @IsString({ message: 'El id público de la imagen debe ser una cadena de texto' })
  imagePublicId?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  active?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true, message: 'Los identificadores de equipos deben ser UUIDs válidos' })
  teamIds?: string[];
}
