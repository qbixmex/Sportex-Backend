import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CommonService } from '../common/common.service.js';
import { ContactMessage } from './entities/contact-message.entity.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';
import { UpdateContactMessageReadDto } from './dto/update-contact-message-read.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

export class ContactMessagesService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactMessageRepository: Repository<ContactMessage>,

    private readonly commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    const [contactMessagesCount, contactMessages] = await Promise.all([
      this.contactMessageRepository
        .createQueryBuilder('contactMessage')
        .getCount(),
      this.contactMessageRepository
        .createQueryBuilder('contactMessage')
        .orderBy('contactMessage.createdAt', 'DESC')
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      contactMessages,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(contactMessagesCount / take),
      },
    };
  }

  async findById(id: string) {
    const contactMessage = await this.contactMessageRepository.findOne({
      where: { id },
    });

    if (!contactMessage) {
      throw new NotFoundException(
        `¡ El mensaje de contacto con id: [${id}], no existe en la base de datos !`
      );
    }

    return contactMessage;
  }

  async create(dto: CreateContactMessageDto) {
    try {
      const contactMessage = this.contactMessageRepository.create({
        ...dto,
        read: false,
      });
      await this.contactMessageRepository.save(contactMessage);

      return {
        message: '¡ Mensaje de contacto enviado satisfactoriamente 👍 !',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async updateRead(id: string, dto: UpdateContactMessageReadDto) {
    const contactMessage = await this.findById(id);
    contactMessage.read = dto.read;

    try {
      await this.contactMessageRepository.save(contactMessage);

      return {
        message: '¡ Estado de lectura actualizado exitosamente 👍 !',
        contactMessage,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const contactMessage = await this.findById(id);

    try {
      await this.contactMessageRepository.remove(contactMessage);

      return {
        message: '¡ Mensaje de contacto eliminado satisfactoriamente 👍 !',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}