import { Body, Controller, Post, Version } from '@nestjs/common';
import { ContactMessagesService } from './contact-messages.service.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';

@Controller('contact-messages')
export class ContactMessagesPublicController {
  constructor(private readonly contactMessagesService: ContactMessagesService) {}

  @Version('1')
  @Post()
  create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactMessagesService.create(createContactMessageDto);
  }
}