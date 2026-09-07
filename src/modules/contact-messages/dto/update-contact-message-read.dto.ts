import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateContactMessageReadDto {
  @IsNotEmpty({ message: '¡ El estado de lectura es obligatorio !' })
  @IsBoolean({ message: '¡ El estado de lectura debe ser un valor boleano !' })
  read!: boolean;
}