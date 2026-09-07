import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Version,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { VALID_ROLES } from '../auth/enums/index.js';
import { ContactMessagesService } from './contact-messages.service.js';
import { UpdateContactMessageReadDto } from './dto/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Controller('contact-messages')
@Auth(VALID_ROLES.ADMIN)
export class ContactMessagesController {
  constructor(private readonly contactMessagesService: ContactMessagesService) {}

  @Version('1')
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contactMessagesService.findAll(paginationDto);
  }

  @Version('1')
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactMessagesService.findById(id);
  }

  @Version('1')
  @Patch(':id')
  updateRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactMessageReadDto: UpdateContactMessageReadDto,
  ) {
    return this.contactMessagesService.updateRead(
      id,
      updateContactMessageReadDto,
    );
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactMessagesService.remove(id);
  }
}