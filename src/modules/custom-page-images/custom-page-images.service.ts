import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CommonService } from '../common/common.service.js';
import { CustomPage } from '../custom-pages/entities/custom-page.entity.js';
import { CustomPageImage } from './entities/custom-page-image.entity.js';
import { CreateCustomPageImageDto } from './dto/create-custom-page-image.dto.js';
import { UpdateCustomPageImageDto } from './dto/update-custom-page-image.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

export class CustomPageImagesService {
  constructor(
    @InjectRepository(CustomPageImage)
    private readonly customPageImageRepository: Repository<CustomPageImage>,

    @InjectRepository(CustomPage)
    private readonly customPageRepository: Repository<CustomPage>,

    private readonly commonService: CommonService,
  ) {}

  async findAll(pageId: string, { page = 1, take = 10 }: PaginationDto) {
    await this.validateCustomPageExists(pageId);

    const [customPageImagesCount, customPageImages] = await Promise.all([
      this.customPageImageRepository
        .createQueryBuilder('customPageImage')
        .where('customPageImage.parentPage = :pageId', { pageId })
        .getCount(),
      this.customPageImageRepository
        .createQueryBuilder('customPageImage')
        .where('customPageImage.parentPage = :pageId', { pageId })
        .orderBy('customPageImage.createdAt', 'ASC')
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      customPageImages,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(customPageImagesCount / take),
      },
    };
  }

  async findById(pageId: string, id: string) {
    await this.validateCustomPageExists(pageId);

    const customPageImage = await this.customPageImageRepository.findOne({
      where: { id, parentPage: { id: pageId } },
    });

    if (!customPageImage) {
      throw new NotFoundException(
        `¡ La imagen de página personalizada con id: [${id}], no existe en la base de datos !`
      );
    }

    return this.stripParentPage(customPageImage);
  }

  async create(pageId: string, dto: CreateCustomPageImageDto) {
    const customPage = await this.validateCustomPageExists(pageId);

    try {
      const customPageImageRaw = this.customPageImageRepository.create({
        ...dto,
        parentPage: { id: customPage.id },
      });
      await this.customPageImageRepository.save(customPageImageRaw);

      const customPageImage = this.stripParentPage(customPageImageRaw);

      return {
        message: '¡ Imagen de página personalizada creada satisfactoriamente 👍 !',
        customPageImage,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(pageId: string, id: string, dto: UpdateCustomPageImageDto) {
    await this.validateCustomPageExists(pageId);

    const customPageImage = await this.customPageImageRepository.findOne({
      where: { id, parentPage: { id: pageId } },
    });

    if (!customPageImage) {
      throw new NotFoundException(
        `¡ La imagen de página personalizada con id: [${id}], no existe en la base de datos !`
      );
    }

    const updatedCustomPageImage = this.customPageImageRepository.merge(
      customPageImage,
      dto,
    );

    try {
      await this.customPageImageRepository.save(updatedCustomPageImage);

      return {
        message: '¡ Imagen de página personalizada actualizada exitosamente 👍 !',
        customPageImage: this.stripParentPage(updatedCustomPageImage),
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(pageId: string, id: string) {
    await this.validateCustomPageExists(pageId);

    const customPageImage = await this.customPageImageRepository.findOne({
      where: { id, parentPage: { id: pageId } },
    });

    if (!customPageImage) {
      throw new NotFoundException(
        `¡ La imagen de página personalizada con id: [${id}], no existe en la base de datos !`
      );
    }

    try {
      await this.customPageImageRepository.remove(customPageImage);

      return {
        message: '¡ Imagen de página personalizada eliminada satisfactoriamente 👍 !',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  private stripParentPage(customPageImage: CustomPageImage) {
    return Object.fromEntries(
      Object.entries(customPageImage).filter(([key]) => key !== 'parentPage')
    );
  }

  private async validateCustomPageExists(pageId: string) {
    const customPage = await this.customPageRepository.findOne({
      where: { id: pageId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!customPage) {
      throw new NotFoundException(
        `¡ La página personalizada con id: [${pageId}], no existe en la base de datos !`
      );
    }

    return customPage;
  }
}