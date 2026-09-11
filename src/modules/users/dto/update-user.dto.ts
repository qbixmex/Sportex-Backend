import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto.js";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean({ message: '¡ La propiedad debe ser del tipo boleano !' })
  @IsOptional()
  emailVerified?: boolean;
}