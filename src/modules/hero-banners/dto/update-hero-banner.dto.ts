import { PartialType } from '@nestjs/mapped-types';
import { CreateHeroBannerDto } from './create-hero-banner.dto.js';

export class UpdateHeroBannerDto extends PartialType(CreateHeroBannerDto) {}