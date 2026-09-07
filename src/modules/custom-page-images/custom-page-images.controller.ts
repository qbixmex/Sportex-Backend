import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { VALID_ROLES } from '../auth/enums/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { CustomPageImagesService } from './custom-page-images.service.js';
import { CreateCustomPageImageDto } from './dto/create-custom-page-image.dto.js';
import { UpdateCustomPageImageDto } from './dto/update-custom-page-image.dto.js';

@Controller('admin/custom-pages/:pageId/images')
@Auth(VALID_ROLES.ADMIN)
export class CustomPageImagesController {
  constructor(
    private readonly customPageImagesService: CustomPageImagesService,
  ) {}

  @Version('1')
  @Get()
  findAll(
    @Param('pageId', ParseUUIDPipe) pageId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.customPageImagesService.findAll(pageId, paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(
    @Param('pageId', ParseUUIDPipe) pageId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.customPageImagesService.findById(pageId, id);
  }

  @Version('1')
  @Post()
  create(
    @Param('pageId', ParseUUIDPipe) pageId: string,
    @Body() createCustomPageImageDto: CreateCustomPageImageDto,
  ) {
    return this.customPageImagesService.create(pageId, createCustomPageImageDto);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('pageId', ParseUUIDPipe) pageId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomPageImageDto: UpdateCustomPageImageDto,
  ) {
    return this.customPageImagesService.update(
      pageId,
      id,
      updateCustomPageImageDto,
    );
  }

  @Version('1')
  @Delete(':id')
  remove(
    @Param('pageId', ParseUUIDPipe) pageId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.customPageImagesService.remove(pageId, id);
  }
}