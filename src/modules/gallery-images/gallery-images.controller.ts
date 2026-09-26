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
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { VALID_ROLES } from '../auth/enums/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { GalleryImagesService } from './gallery-images.service.js';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto.js';
import { UpdateGalleryImageDto } from './dto/update-gallery-image.dto.js';

@Auth(VALID_ROLES.ADMIN)
@ApiTags('Gallery Images')
@Controller('galleries/:galleryId/images')
export class GalleryImagesController {
  constructor(private readonly galleryImagesService: GalleryImagesService) {}

  @Version('1')
  @Get()
  findAll(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.galleryImagesService.findAll(galleryId, paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.galleryImagesService.findById(galleryId, id);
  }

  @Version('1')
  @Post()
  create(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Body() createGalleryImageDto: CreateGalleryImageDto,
  ) {
    return this.galleryImagesService.create(galleryId, createGalleryImageDto);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGalleryImageDto: UpdateGalleryImageDto,
  ) {
    return this.galleryImagesService.update(
      galleryId,
      id,
      updateGalleryImageDto,
    );
  }

  @Version('1')
  @Delete(':id')
  remove(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.galleryImagesService.remove(galleryId, id);
  }
}