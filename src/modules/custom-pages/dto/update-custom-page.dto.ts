import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomPageDto } from './create-custom-page.dto.js';

export class UpdateCustomPageDto extends PartialType(CreateCustomPageDto) {}