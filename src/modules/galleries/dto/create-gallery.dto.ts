import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateGalleryDto {
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(3, { message: 'El título debe ser mayor ó igual a 3 caracteres' })
  title!: string;

  @IsString({ message: 'El enlace permanente debe ser una cadena de texto' })
  @MinLength(3, { message: 'El enlace permanente debe ser igual o mayor a 3 caracteres' })
  @IsOptional()
  permalink?: string;

  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  @IsOptional()
  active?: boolean;
}