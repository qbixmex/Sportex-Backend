import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Version,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoachesService } from './coaches.service.js';
import { CreateCoachDto, UpdateCoachDto } from './dto/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { VALID_ROLES } from '../auth/enums/index.js';

@ApiTags('Coaches')
@Auth(VALID_ROLES.ADMIN)
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Version('1')
  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.coachesService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.coachesService.findById(id);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCoachDto: UpdateCoachDto,
  ) {
    return this.coachesService.update(id, updateCoachDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coachesService.remove(id);
  }
}
