import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { type Gender, GENDER } from '../../teams/enums/index.js';

export class CreateTeamDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe ser igual o mayor a 2 caracteres' })
  name!: string;

  @IsNotEmpty({ message: 'El enlace permanente es obligatorio' })
  @IsString({ message: 'El enlace permanente debe ser una cadena de texto' })
  @MinLength(2, { message: 'El enlace permanente debe ser igual o mayor a 2 caracteres' })
  permalink!: string;

  @IsNotEmpty({ message: 'El formato es obligatorio' })
  @IsString({ message: 'El formato debe ser una cadena de texto' })
  @MinLength(1, { message: 'El formato debe ser igual o mayor a 1 caracter' })
  format!: string;

  @IsOptional()
  @IsEnum(GENDER, { message: 'El género debe ser un valor válido' })
  gender?: Gender;

  @IsOptional()
  @IsString({ message: 'El url de la imagen debe ser una cadena de texto' })
  imageUrl?: string;

  @IsOptional()
  @IsString({ message: 'El id público de la imagen debe ser una cadena de texto' })
  imagePublicId?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  state?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Los emails deben ser cadenas de texto' })
  emails?: string[];

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  address?: string;

  @IsOptional()
  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  active?: boolean;

  @ValidateIf((o) => o.tournamentId !== null && o.tournamentId !== undefined)
  @IsUUID('all', { message: 'El identificador del torneo debe ser un UUID válido' })
  tournamentId?: string | null;

  @ValidateIf((o) => o.categoryId !== null && o.categoryId !== undefined)
  @IsUUID('all', { message: 'El identificador de la categoría debe ser un UUID válido' })
  categoryId?: string | null;

  @ValidateIf((o) => o.coachId !== null && o.coachId !== undefined)
  @IsUUID('all', { message: 'El identificador del entrenador debe ser un UUID válido' })
  coachId?: string | null;

  @IsEmpty()
  tournament?: never;

  @IsEmpty()
  category?: never;

  @IsEmpty()
  coach?: never;
}
