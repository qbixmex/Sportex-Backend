import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  Patch,
  Version,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { HeroBannersService } from './hero-banners.service.js';
import { CreateHeroBannerDto, UpdateHeroBannerDto } from './dto/index.js';
import { VALID_ROLES } from '../auth/enums/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Auth(VALID_ROLES.ADMIN)
@Controller('hero-banners')
export class HeroBannersController {
  constructor(private readonly heroBannersService: HeroBannersService) {}

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.heroBannersService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.heroBannersService.findById(id);
  }

  @Version('1')
  @Post()
  create(@Body() createHeroBannerDto: CreateHeroBannerDto) {
    return this.heroBannersService.create(createHeroBannerDto);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHeroBannerDto: UpdateHeroBannerDto,
  ) {
    return this.heroBannersService.update(id, updateHeroBannerDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.heroBannersService.remove(id);
  }
}