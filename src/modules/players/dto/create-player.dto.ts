import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe ser igual o mayor a 3 caracteres' })
  name!: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  phone?: string;

  @IsOptional()
  @IsDateString(undefined, {
    message: 'El formato de fecha de cumpleaños es incorrecto, ejemplo: "2000-08-15"'
  })
  birthday?: string;

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
  @IsBoolean({ message: 'La propiedad activo debe ser del tipo boleano' })
  active?: boolean;

  @ValidateIf((o) => o.teamId !== null && o.teamId !== undefined)
  @IsUUID('all', { message: 'El identificador del equipo debe ser un UUID válido' })
  teamId?: string | null;

  @IsEmpty()
  team?: never;
}
