import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PAGE_STATUS } from '../enums/page-status.enum.js';
import type { PageStatus } from '../enums/page-status.enum.js';
import { SEO_ROBOTS } from '../enums/seo-robots.enum.js';
import type { SeoRobots } from '../enums/seo-robots.enum.js';

export class CreateCustomPageDto {
  @IsNotEmpty({ message: '¡ El título es obligatorio !' })
  @IsString({ message: '¡ El título debe ser una cadena de texto !' })
  @MinLength(4, { message: '¡ El título debe ser mayor ó igual a 4 caracteres !' })
  title!: string;

  @IsOptional()
  @IsString({ message: '¡ El enlace permanente debe ser una cadena de texto !' })
  @MinLength(4, {
    message: '¡ El enlace permanente debe ser mayor ó igual a 4 caracteres !',
  })
  permalink!: string;

  @IsOptional()
  @IsString({ message: '¡ El contenido debe ser una cadena de texto !' })
  @MinLength(8, { message: '¡ El contenido debe ser mayor ó igual a 8 caracteres !' })
  content?: string;

  @IsOptional()
  @IsInt({ message: '¡ La posición debe ser un número entero !' })
  position?: number;

  @IsOptional()
  @IsString({ message: '¡ El título de SEO debe ser una cadena de texto !' })
  @MinLength(8, { message: '¡ El título de SEO debe ser mayor ó igual a 8 caracteres !', })
  @MaxLength(80, { message: '¡ El título de SEO debe ser menor ó igual a 80 caracteres !', })
  seoTitle?: string;

  @IsOptional()
  @IsString({ message: '¡ La descripción de SEO debe ser una cadena de texto !' })
  @MinLength(4, { message: '¡ La descripción de SEO debe ser mayor ó igual a 4 caracteres !', })
  @MaxLength(170, { message: '¡ La descripción de SEO debe ser menor ó igual a 170 caracteres !', })
  seoDescription?: string;

  @IsOptional()
  @IsEnum(SEO_ROBOTS, { message: "¡ Los robots debe ser uno de estos: ['index, follow', 'index, nofollow', 'noindex, follow', 'noindex, nofollow'] !" })
  seoRobots?: SeoRobots;

  @IsOptional()
  @IsEnum(PAGE_STATUS, { message: "¡ El estado debe ser uno de estos: [ 'draft', 'hold', 'unpublished', 'published'] !" })
  status?: PageStatus;
}