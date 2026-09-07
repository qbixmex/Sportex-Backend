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
import { CustomPagesService } from './custom-pages.service.js';
import { CreateCustomPageDto } from './dto/create-custom-page.dto.js';
import { UpdateCustomPageDto } from './dto/update-custom-page.dto.js';

@Controller('admin/custom-pages')
@Auth(VALID_ROLES.ADMIN)
export class CustomPagesController {
  constructor(private readonly customPagesService: CustomPagesService) {}

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customPagesService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.customPagesService.findById(id);
  }

  @Version('1')
  @Post()
  create(@Body() createCustomPageDto: CreateCustomPageDto) {
    return this.customPagesService.create(createCustomPageDto);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomPageDto: UpdateCustomPageDto,
  ) {
    return this.customPagesService.update(id, updateCustomPageDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customPagesService.remove(id);
  }
}