import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommonService } from '../common/common.service.js';
import { Gallery } from '../galleries/entities/gallery.entity.js';
import { GalleryImage } from './entities/gallery-image.entity.js';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto.js';
import { UpdateGalleryImageDto } from './dto/update-gallery-image.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

export class GalleryImagesService {
  constructor(
    @InjectRepository(GalleryImage)
    private readonly galleryImageRepository: Repository<GalleryImage>,

    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,

    private readonly commonService: CommonService,
  ) { }

  async findAll(galleryId: string, { page = 1, take = 10 }: PaginationDto) {
    await this.validateGalleryExists(galleryId);

    const [galleryImagesCount, galleryImages] = await Promise.all([
      this.galleryImageRepository
        .createQueryBuilder('galleryImage')
        .where('galleryImage.gallery = :galleryId', { galleryId })
        .getCount(),
      this.galleryImageRepository
        .createQueryBuilder('galleryImage')
        .where('galleryImage.gallery = :galleryId', { galleryId })
        .orderBy('galleryImage.position', 'ASC')
        .addOrderBy('galleryImage.createdAt', 'ASC')
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      galleryImages,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(galleryImagesCount / take),
      },
    };
  }

  async findById(galleryId: string, id: string) {
    await this.validateGalleryExists(galleryId);

    const galleryImage = await this.galleryImageRepository.findOne({
      where: { id, gallery: { id: galleryId } },
    });

    if (!galleryImage) {
      throw new NotFoundException(
        'La imagen de galería no existe con el identificador proporcionado'
      );
    }

    return this.stripGallery(galleryImage);
  }

  async create(galleryId: string, dto: CreateGalleryImageDto) {
    const gallery = await this.validateGalleryExists(galleryId);

    const galleryImageExists = await this.galleryImageRepository.count({
      where: { imageUrl: dto.imageUrl },
    });

    if (galleryImageExists > 0) {
      throw new ConflictException(
        `La imagen con el url [${dto.imageUrl}] ya existe, elija otro url`
      );
    }

    try {
      const galleryImageRaw = this.galleryImageRepository.create({
        ...dto,
        gallery: { id: gallery.id },
        active: dto.active ?? false,
      });
      await this.galleryImageRepository.save(galleryImageRaw);

      const galleryImage = this.stripGallery(galleryImageRaw);

      return {
        message: 'Imagen de galería creada satisfactoriamente',
        galleryImage,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(galleryId: string, id: string, dto: UpdateGalleryImageDto) {
    await this.validateGalleryExists(galleryId);

    const galleryImage = await this.galleryImageRepository.findOne({
      where: { id, gallery: { id: galleryId } },
    });

    if (!galleryImage) {
      throw new NotFoundException(
        'La imagen de galería no existe con el identificador proporcionado'
      );
    }

    if (dto.imageUrl !== undefined && dto.imageUrl !== galleryImage.imageUrl) {
      const existingImage = await this.galleryImageRepository.findOne({
        where: { imageUrl: dto.imageUrl },
      });

      if (existingImage && existingImage.id !== id) {
        throw new ConflictException(
          `La imagen con el url [${dto.imageUrl}] ya existe, elija otro url`
        );
      }
    }

    const updatedGalleryImage = this.galleryImageRepository.merge(
      galleryImage,
      dto,
    );

    try {
      await this.galleryImageRepository.save(updatedGalleryImage);

      return {
        message: 'Imagen de galería actualizada exitosamente',
        galleryImage: this.stripGallery(updatedGalleryImage),
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(galleryId: string, id: string) {
    await this.validateGalleryExists(galleryId);

    const galleryImage = await this.galleryImageRepository.findOne({
      where: { id, gallery: { id: galleryId } },
    });

    if (!galleryImage) {
      throw new NotFoundException(
        'La imagen de galería no existe con el identificador proporcionado'
      );
    }

    try {
      await this.galleryImageRepository.remove(galleryImage);

      return {
        message: 'Imagen de galería eliminada satisfactoriamente',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  private stripGallery(galleryImage: GalleryImage) {
    return Object.fromEntries(
      Object.entries(galleryImage).filter(([key]) => key !== 'gallery')
    );
  }

  private async validateGalleryExists(galleryId: string) {
    const gallery = await this.galleryRepository.findOne({
      where: { id: galleryId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!gallery) {
      throw new NotFoundException(
        'La galería no existe con el identificador proporcionado'
      );
    }

    return gallery;
  }
}