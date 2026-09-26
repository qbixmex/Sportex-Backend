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
import { TournamentsService } from './tournaments.service.js';
import { CreateTournamentDto, UpdateTournamentDto } from './dto/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { VALID_ROLES } from '../auth/enums/index.js';

@Controller('tournaments')
@ApiTags('Tournaments')
@Auth(VALID_ROLES.ADMIN)
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Version('1')
  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tournamentsService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findByOne(@Param('id') id: string) {
    return this.tournamentsService.findById(id);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentsService.remove(id);
  }
}
