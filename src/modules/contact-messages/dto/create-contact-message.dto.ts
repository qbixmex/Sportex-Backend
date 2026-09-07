import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @IsNotEmpty({ message: '¡ El nombre es obligatorio !' })
  @IsString({ message: '¡ El nombre debe ser una cadena de texto !' })
  @MinLength(3, { message: '¡ El nombre debe ser mayor ó igual a 3 caracteres !' })
  name!: string;

  @IsNotEmpty({ message: '¡ El correo electrónico es obligatorio !' })
  @IsEmail(undefined, { message: '¡ El correo electrónico debe ser una dirección de correo válida !' })
  email!: string;

  @IsNotEmpty({ message: '¡ El mensaje es obligatorio !' })
  @IsString({ message: '¡ El mensaje debe ser una cadena de texto !' })
  @MinLength(8, { message: '¡ El mensaje debe ser mayor ó igual a 8 caracteres !' })
  message!: string;
}