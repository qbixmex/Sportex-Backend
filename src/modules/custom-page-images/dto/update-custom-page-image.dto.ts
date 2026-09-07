import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomPageImageDto } from './create-custom-page-image.dto.js';

export class UpdateCustomPageImageDto extends PartialType(CreateCustomPageImageDto) {}