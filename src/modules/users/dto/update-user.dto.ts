import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto.js";
import { IsArray, IsBoolean, IsEnum, IsOptional } from "class-validator";
import { VALID_ROLES } from "../../auth/enums/index.js";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean({ message: '¡ La propiedad debe ser del tipo boleano !' })
  @IsOptional()
  emailVerified?: boolean;
}