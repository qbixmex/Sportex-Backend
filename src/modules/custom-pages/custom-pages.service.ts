import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommonService } from '../common/common.service.js';
import { CustomPage } from './entities/custom-page.entity.js';
import { CreateCustomPageDto } from './dto/create-custom-page.dto.js';
import { UpdateCustomPageDto } from './dto/update-custom-page.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { formatPermalinkOrSlug } from '../../utils/format_permalink.util.js';
import { PAGE_STATUS } from './enums/page-status.enum.js';
import { SEO_ROBOTS } from './enums/seo-robots.enum.js';

export class CustomPagesService {
  constructor(
    @InjectRepository(CustomPage)
    private readonly customPageRepository: Repository<CustomPage>,

    private readonly commonService: CommonService,
  ) { }

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    const [customPagesCount, customPages] = await Promise.all([
      this.customPageRepository.createQueryBuilder('customPage').getCount(),
      this.customPageRepository
        .createQueryBuilder('customPage')
        .orderBy('customPage.position', 'ASC')
        .addOrderBy('customPage.createdAt', 'ASC')
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      customPages,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(customPagesCount / take),
      },
    };
  }

  async findById(id: string) {
    const customPage = await this.customPageRepository.findOne({
      where: { id },
      relations: { images: true },
    });

    if (!customPage) {
      throw new NotFoundException(
        `¡ La página personalizada con id: [${id}], no existe en la base de datos !`
      );
    }

    return customPage;
  }

  async create(dto: CreateCustomPageDto) {
    let permalink: string | undefined = undefined;

    if (dto.permalink) {
      permalink = formatPermalinkOrSlug(dto.permalink);

      if (!permalink) {
        throw new BadRequestException(
          '¡ El enlace permanente no puede quedar vacío después de normalizarse !'
        );
      }

      const existingCustomPage = await this.customPageRepository.count({
        where: { permalink },
      });
  
      if (existingCustomPage > 0) {
        throw new ConflictException(
          `¡ La página personalizada con el enlace permanente [${permalink}] ya existe, elija otro permalink !`
        );
      }
    }

    try {
      const customPage = this.customPageRepository.create({
        ...dto,
        permalink,
        status: dto.status ?? PAGE_STATUS.DRAFT,
        seoRobots: dto.seoRobots ?? SEO_ROBOTS.NOINDEX_NOFOLLOW,
      });
      await this.customPageRepository.save(customPage);

      return {
        message: '¡ Página personalizada fue creada satisfactoriamente 👍 !',
        customPage,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateCustomPageDto) {
    const customPage = await this.customPageRepository.findOne({
      where: { id },
    });

    if (!customPage) {
      throw new NotFoundException(
        `¡ La página personalizada con id: [${id}], no existe en la base de datos !`
      );
    }

    const updateData = { ...dto };
    let permalinkChanged = false;

    if (dto.permalink !== undefined) {
      const permalink = formatPermalinkOrSlug(dto.permalink);

      if (!permalink) {
        throw new BadRequestException(
          '¡ El enlace permanente no puede llevar emojis, caracteres especiales ó acentos en vocales "áéíóú" !'
        );
      }

      if (permalink !== customPage.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    } else if (dto.title !== undefined) {
      const permalink = formatPermalinkOrSlug(dto.title);

      if (permalink !== customPage.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    }

    if (permalinkChanged) {
      const existingCustomPage = await this.customPageRepository.count({
        where: { permalink: updateData.permalink },
      });

      if (existingCustomPage > 0) {
        throw new ConflictException(
          `¡ La página personalizada con el enlace permanente [${updateData.permalink}] ya existe, elija otro permalink !`
        );
      }
    }

    const updatedCustomPage = this.customPageRepository.merge(
      customPage,
      updateData,
    );

    try {
      await this.customPageRepository.save(updatedCustomPage);

      return {
        message: '¡ Página personalizada fue actualizada exitosamente 👍 !',
        customPage: updatedCustomPage,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const customPage = await this.customPageRepository.findOne({
      where: { id },
    });

    if (!customPage) {
      throw new NotFoundException(
        `¡ La página personalizada con id: [${id}], no existe en la base de datos !`
      );
    }

    try {
      await this.customPageRepository.remove(customPage);

      return {
        message: '¡ Página personalizada eliminada satisfactoriamente 👍 !',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findPublishedAll({ page = 1, take = 10 }: PaginationDto) {
    const [customPagesCount, customPages] = await Promise.all([
      this.customPageRepository
        .createQueryBuilder('customPage')
        .where('customPage.status = :status', { status: PAGE_STATUS.PUBLISHED })
        .getCount(),
      this.customPageRepository
        .createQueryBuilder('customPage')
        .select([
          'customPage.id',
          'customPage.title',
          'customPage.permalink',
          'customPage.position',
          'customPage.seoTitle',
          'customPage.seoDescription',
        ])
        .where('customPage.status = :status', { status: PAGE_STATUS.PUBLISHED })
        .orderBy('customPage.position', 'ASC')
        .addOrderBy('customPage.createdAt', 'ASC')
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      customPages,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(customPagesCount / take),
      },
    };
  }

  async findPublishedByPermalink(permalink: string) {
    const parsedPermalink = formatPermalinkOrSlug(permalink);

    const customPage = await this.customPageRepository.findOne({
      where: {
        permalink: parsedPermalink,
        status: PAGE_STATUS.PUBLISHED,
      },
      relations: { images: true },
    });

    if (!customPage) {
      throw new NotFoundException(
        `¡ La página personalizada publicada con enlace permanente [${parsedPermalink}], no existe en la base de datos !`
      );
    }

    return customPage;
  }
}