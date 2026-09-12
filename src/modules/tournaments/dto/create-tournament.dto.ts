import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateTournamentDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(4, { message: 'El nombre debe ser igual o mayor a 4 caracteres' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'El enlace permanente debe ser una cadena de texto' })
  @MinLength(4, { message: 'El enlace permanente debe ser igual o mayor a 4 caracteres' })
  permalink?: string;

  @IsString({ message: 'El url de la imagen debe ser una cadena de texto' })
  @IsUrl({ protocols: ['https'] }, { message: "Los url deben comenzar con [https]" })
  @IsOptional()
  imageUrl?: string;

  @IsString({ message: 'El id público de la imagen debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(1, { message: 'El id público debe ser mínimo de 1 caracter' })
  imagePublicId?: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(8, { message: 'La descripción debe ser igual o mayor a 8 caracteres' })
  @MaxLength(255, { message: 'La descripción debe ser menor o igual a 255 caracteres' })
  description?: string;

  @IsString({ message: 'La etapa debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(2, { message: 'La etapa debe ser igual o mayor a 2 caracteres' })
  stage?: string;

  @IsString({ message: 'El país debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(3, { message: 'El país debe ser igual o mayor a 3 caracteres' })
  country?: string;

  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(2, { message: 'El estado debe ser igual o mayor a 2 caracteres' })
  state?: string;

  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(3, { message: 'La ciudad debe ser igual o mayor a 3 caracteres' })
  city?: string;

  @IsString({ message: 'La temporada debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(4, { message: 'La temporada debe ser igual o mayor a 4 caracteres' })
  season?: string;

  @IsDateString(undefined, {
    message: 'El formato de fecha de inicio es incorrecto, ejemplo: "2024-08-15T14:00:00.000"'
  })
  @IsOptional()
  startDate!: Date;

  @IsDateString(undefined, {
    message: 'El formato de fecha final es incorrecto, ejemplo: "2024-08-15T14:00:00.000"'
  })
  @IsOptional()
  endDate!: Date;

  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  @IsOptional()
  active?: boolean;
}
