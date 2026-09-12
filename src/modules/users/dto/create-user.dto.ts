import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";
import { VALID_ROLES } from "../../auth/enums/valid-roles.enum.js";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    example: 'jhon@gmail.com',
    description: 'Correo electrónico del usuario',
    nullable: false,
    uniqueItems: true,
  })
  @IsString({ message: 'El email debe ser una cadena de texto' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email!: string;

  @ApiProperty({
    example: 'your_super_difficult_password',
    description: 'Contraseña del usuario',
    nullable: false,
    uniqueItems: true,
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe ser igual o mayor a 8 caracteres' })
  @MaxLength(100, { message: 'La contraseña debe ser menor o igual a 100 caracteres' })
  password!: string;

  @ApiProperty({
    example: 'Javier García López',
    description: 'Nombre completo del usuario',
    nullable: true,
    maxLength: 200,
  })
  @ApiProperty({
    description: 'Nombre completo del usuario',
    nullable: true,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe ser igual o mayor a 3 caracteres' })
  name?: string;

  @ApiProperty({
    example: 'johnny',
    description: 'Nombre de usuario',
    uniqueItems: true,
    nullable: true,
    maxLength: 200,
  })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(3, { message: 'El nombre de usuario debe ser igual o mayor a 3 caracteres' })
  username?: string;

  @IsString({ message: 'El url de la imagen debe ser una cadena de texto' })
  @IsOptional()
  @IsUrl({ protocols: ['https'] }, { message: "Los url deben comenzar con [https]" })
  @MinLength(1, { message: 'El id público debe ser mínimo de 1 caracter' })
  imageUrl?: string;

  @IsString({ message: 'El id público de la imagen debe ser una cadena de texto' })
  @IsOptional()
  @MinLength(1, { message: 'El id público debe ser mínimo de 1 caracter' })
  imagePublicId?: string;

  @ApiProperty({
    description: 'Roles de usuario',
    nullable: true,
    examples: [
      ['user'],
      ['user', 'admin'],
    ],
    default: ['user'],
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(VALID_ROLES, {
    each: true,
    message: 'Los roles deben ser "admin" ó "user"',
  })
  roles?: string[];

  @ApiProperty({
    examples: [false, true],
    description: 'Roles de usuario',
    nullable: true,
    default: false,
  })
  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  @IsOptional()
  isActive?: boolean;
}
