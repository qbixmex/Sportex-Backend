import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommonService } from '../common/common.service.js';
import { Announcement } from './entities/announcement.entity.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { formatPermalinkOrSlug } from '../../utils/format_permalink.util.js';

export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,

    private commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto, active?: boolean) {
    const query = this.announcementRepository.createQueryBuilder('announcement');

    if (active !== undefined) {
      query.where('announcement.active = :active', { active });
    }

    const [announcementsCount, announcements] = await Promise.all([
      query.clone().getCount(),
      query
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      announcements,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(announcementsCount / take),
      },
    };
  }

  async findById(id: string, active?: boolean) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(
        'El anuncio no existe con el identificador proporcionado'
      );
    }

    if (active === true && !announcement.active) {
      throw new NotFoundException(
        `El anuncio con id: [${id}], no está publicado`
      );
    }

    return announcement;
  }

  async create(dto: CreateAnnouncementDto) {
    const permalink = formatPermalinkOrSlug(
      dto.permalink !== undefined ? dto.permalink : dto.title,
    );

    if (!permalink) {
      throw new BadRequestException(
        'El enlace permanente no puede quedar vacío después de normalizarse'
      );
    }

    const existingAnnouncement = await this.announcementRepository.findOne({
      where: { permalink },
    });

    if (existingAnnouncement) {
      throw new ConflictException(
        `El anuncio con el enlace permanente [${permalink}] ya existe, elija otro título o permalink`
      );
    }

    try {
      const announcement = this.announcementRepository.create({
        ...dto,
        permalink,
        active: dto.active ?? false,
      });
      await this.announcementRepository.save(announcement);
      return announcement;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(
        'El anuncio no existe con el identificador proporcionado'
      );
    }

    const updateData = { ...dto };
    let permalinkChanged = false;

    if (dto.permalink !== undefined) {
      const permalink = formatPermalinkOrSlug(dto.permalink);

      if (!permalink) {
        throw new BadRequestException(
          'El enlace permanente no puede llevar emojis, caracteres especiales ó acentos en vocales "áéíóú"'
        );
      }

      if (permalink !== announcement.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    } else if (dto.title !== undefined) {
      const permalink = formatPermalinkOrSlug(dto.title);

      if (permalink !== announcement.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    }

    if (permalinkChanged) {
      const existingAnnouncement = await this.announcementRepository.findOne({
        where: { permalink: updateData.permalink },
      });

      if (existingAnnouncement && existingAnnouncement.id !== id) {
        throw new ConflictException(
          `El anuncio con el enlace permanente [${updateData.permalink}] ya existe, elija otro título o permalink`
        );
      }
    }

    const updatedAnnouncement = this.announcementRepository.merge(
      announcement,
      updateData,
    );

    try {
      await this.announcementRepository.save(updatedAnnouncement);

      return {
        message: 'Anuncio actualizado exitosamente',
        announcement: updatedAnnouncement,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(
        'El anuncio no existe con el identificador proporcionado'
      );
    }

    try {
      await this.announcementRepository.remove(announcement);

      return {
        message: 'Anuncio eliminado satisfactoriamente',
        announcement,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}