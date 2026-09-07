import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateCustomPageImageDto {
  @IsNotEmpty({ message: '¡ El título es obligatorio !' })
  @IsString({ message: '¡ El título debe ser una cadena de texto !' })
  @MinLength(4, { message: '¡ El título debe ser mayor ó igual a 4 caracteres !' })
  title!: string;

  @IsNotEmpty({ message: '¡ El url de la imagen es obligatorio !' })
  @IsString({ message: '¡ El url de la imagen debe ser una cadena de texto !' })
  @IsUrl({ protocols: ['https'] }, { message: 'Los url deben comenzar con [https]' })
  imageUrl!: string;

  @IsNotEmpty({ message: '¡ El id público de la imagen es obligatorio !' })
  @IsString({ message: '¡ El id público de la imagen debe ser una cadena de texto !' })
  @MinLength(4, { message: '¡ El id público de la imagen debe ser mayor ó igual a 4 caracteres !' })
  imagePublicId!: string;
}