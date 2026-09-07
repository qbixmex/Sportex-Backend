import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { CustomPagesService } from './custom-pages.service.js';

@Controller('custom-pages')
export class CustomPagesPublicController {
  constructor(private readonly customPagesService: CustomPagesService) {}

  @Version('1')
  @Get()
  findPublishedAll(@Query() paginationDto: PaginationDto) {
    return this.customPagesService.findPublishedAll(paginationDto);
  }

  @Version('1')
  @Get(':permalink')
  findPublishedByPermalink(@Param('permalink') permalink: string) {
    return this.customPagesService.findPublishedByPermalink(permalink);
  }
}