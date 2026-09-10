import { Type } from "class-transformer";
import { IsOptional, IsString, Min } from "class-validator";

export class SearchParamsDto {
  @IsOptional()
  @IsString({ message: '¡ El término de búsqueda debe ser una cadena de texto !' })
  search_term?: string;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  take?: number;
}