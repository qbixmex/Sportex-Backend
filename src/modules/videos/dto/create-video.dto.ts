import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty({ message: '¡ El título es obligatorio !' })
  @IsString({ message: '¡ El título debe ser una cadena de texto !' })
  @MinLength(3, { message: '¡ El título debe ser mayor ó igual a 3 caracteres !' })
  title!: string;

  @IsString({ message: '¡ El enlace permanente debe ser una cadena de texto !' })
  @MinLength(3, { message: '¡ El enlace permanente debe ser igual o mayor a 3 caracteres !' })
  @IsOptional()
  permalink?: string;

  @IsString({ message: '¡ La descripción debe ser una cadena de texto !' })
  @MinLength(8, { message: '¡ La descripción debe ser igual o mayor a 8 caracteres !' })
  @IsOptional()
  description?: string;

  @IsNotEmpty({ message: '¡ El enlace del video es obligatorio !' })
  @IsString({ message: '¡ El enlace del video debe ser una cadena de texto !' })
  @IsUrl(
    { protocols: ['https'] },
    { message: '¡ El enlace del video debe comenzar con [https] !' },
  )
  url!: string;

  @IsNotEmpty({ message: '¡ La plataforma es obligatoria !' })
  @MinLength(1, { message: '¡ La plataforma por lo menos debe tener 1 caracter !' })
  @IsString({ message: '¡ La plataforma debe ser una cadena de texto !' })
  platform!: string;

  @IsString({ message: '¡ La fecha de publicación debe ser una cadena de texto !' })
  @IsDateString({
    strict: true,
  }, {
    message: '¡ El formato de la fecha de publicación es incorrecto, ejemplo: "2024-08-15T14:00:00.000" !',
  })
  @IsOptional()
  publishedDate?: string;

  @IsBoolean({ message: '¡ La propiedad activo debe ser del tipo boleano !' })
  @IsOptional()
  active?: boolean;
}