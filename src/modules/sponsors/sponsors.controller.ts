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
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { SponsorsService } from './sponsors.service.js';
import { CreateSponsorDto, UpdateSponsorDto } from './dto/index.js';
import { VALID_ROLES } from '../auth/enums/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Auth(VALID_ROLES.ADMIN)
@ApiTags('Sponsors')
@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.sponsorsService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sponsorsService.findById(id);
  }

  @Version('1')
  @Post()
  create(@Body() createSponsorDto: CreateSponsorDto) {
    return this.sponsorsService.create(createSponsorDto);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSponsorDto: UpdateSponsorDto,
  ) {
    return this.sponsorsService.update(id, updateSponsorDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sponsorsService.remove(id);
  }
}