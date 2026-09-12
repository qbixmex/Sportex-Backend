import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateGalleryImageDto {
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(3, { message: 'El título debe ser mayor ó igual a 3 caracteres' })
  title!: string;

  @IsNotEmpty({ message: 'El url de la imagen es obligatorio' })
  @IsString({ message: 'El url de la imagen debe ser una cadena de texto' })
  @IsUrl({ protocols: ['https'] }, { message: 'Los url deben comenzar con [https]' })
  imageUrl!: string;

  @IsNotEmpty({ message: 'El id público de la imagen es obligatorio' })
  @IsString({ message: 'El id público de la imagen debe ser una cadena de texto' })
  @MinLength(4, { message: 'El id público debe ser mínimo de 4 caracteres' })
  imagePublicId!: string;

  @IsOptional()
  @IsNumber(undefined, { message: 'La posición debe ser un número' })
  @IsPositive({ message: 'La posición debe ser un número positivo' })
  position?: number;

  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  @IsOptional()
  active?: boolean;
}