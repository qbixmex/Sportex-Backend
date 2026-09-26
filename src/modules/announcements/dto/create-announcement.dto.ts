import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateAnnouncementDto {
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(3, { message: 'El título debe ser mayor ó igual a 3 caracteres' })
  title!: string;

  @IsString({ message: 'El enlace permanente debe ser una cadena de texto' })
  @MinLength(3, { message: 'El enlace permanente debe ser igual o mayor a 3 caracteres' })
  @IsOptional()
  permalink?: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(8, { message: 'La descripción debe ser igual o mayor a 8 caracteres' })
  description!: string;

  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @IsString({ message: 'El contenido debe ser una cadena de texto' })
  @MinLength(8, { message: 'El contenido debe ser igual o mayor a 8 caracteres' })
  content!: string;

  @IsDateString(undefined, {
    message: 'El formato de fecha de publicación es incorrecto, ejemplo: "2024-08-15T14:00:00.000"'
  })
  @IsOptional()
  publishedAt?: string;

  @IsString({ message: 'El url de la imagen debe ser una cadena de texto' })
  @IsUrl({
    protocols: ["https"]
  }, {
    message: "Los url deben comenzar con [https]"
  })
  @IsOptional()
  imageUrl?: string;

  @IsString({ message: 'El id público de la imagen debe ser una cadena de texto' })
  @MinLength(4, { message: 'El id público debe ser mínimo de 4 caracteres' })
  @IsOptional()
  imagePublicId?: string;

  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  @IsOptional()
  active?: boolean;
}