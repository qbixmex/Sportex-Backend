import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommonService } from '../common/common.service.js';
import { Gallery } from './entities/gallery.entity.js';
import { CreateGalleryDto } from './dto/create-gallery.dto.js';
import { UpdateGalleryDto } from './dto/update-gallery.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { formatPermalinkOrSlug } from '../../utils/format_permalink.util.js';

export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,

    private readonly commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    const [galleriesCount, galleries] = await Promise.all([
      this.galleryRepository.createQueryBuilder('gallery').getCount(),
      this.galleryRepository
        .createQueryBuilder('gallery')
        .orderBy('gallery.createdAt', 'ASC')
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      galleries,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(galleriesCount / take),
      },
    };
  }

  async findById(id: string) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException(
        'La galería no existe con el identificador proporcionado'
      );
    }

    return gallery;
  }

  async create(dto: CreateGalleryDto) {
    const permalink = formatPermalinkOrSlug(
      dto.permalink !== undefined ? dto.permalink : dto.title,
    );

    if (!permalink) {
      throw new BadRequestException(
        'El enlace permanente no puede quedar vacío después de normalizarse'
      );
    }

    const existingGallery = await this.galleryRepository.findOne({
      where: { permalink },
    });

    if (existingGallery) {
      throw new ConflictException(
        `La galería con el enlace permanente [${permalink}] ya existe, elija otro título`
      );
    }

    try {
      const gallery = this.galleryRepository.create({
        ...dto,
        permalink,
        active: dto.active ?? false,
      });
      await this.galleryRepository.save(gallery);

      return {
        message: 'Galería creada satisfactoriamente',
        gallery,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateGalleryDto) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException(
        'La galería no existe con el identificador proporcionado'
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

      if (permalink !== gallery.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    } else if (dto.title !== undefined) {
      const permalink = formatPermalinkOrSlug(dto.title);

      if (permalink !== gallery.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    }

    if (permalinkChanged) {
      const existingGallery = await this.galleryRepository.findOne({
        where: { permalink: updateData.permalink },
      });

      if (existingGallery && existingGallery.id !== id) {
        throw new ConflictException(
          `La galería con el enlace permanente [${updateData.permalink}] ya existe, elija otro permalink`
        );
      }
    }

    const updatedGallery = this.galleryRepository.merge(gallery, updateData);

    try {
      await this.galleryRepository.save(updatedGallery);

      return {
        message: 'Galería actualizada exitosamente',
        gallery: updatedGallery,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const gallery = await this.galleryRepository.findOne({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException(
        'La galería no existe con el identificador proporcionado'
      );
    }

    try {
      await this.galleryRepository.remove(gallery);

      return {
        message: 'Galería eliminada satisfactoriamente',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}