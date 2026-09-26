import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommonService } from '../common/common.service.js';
import { Video } from './entities/video.entity.js';
import { CreateVideoDto } from './dto/create-video.dto.js';
import { UpdateVideoDto } from './dto/update-video.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { formatPermalinkOrSlug } from '../../utils/format_permalink.util.js';

export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    private readonly commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    const [videosCount, videos] = await Promise.all([
      this.videoRepository.createQueryBuilder('video').getCount(),
      this.videoRepository
        .createQueryBuilder('video')
        .orderBy('video.createdAt', 'ASC')
        .take(take)
        .skip((page - 1) * take)
        .getMany(),
    ]);

    return {
      videos,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(videosCount / take),
      },
    };
  }

  async findById(id: string) {
    const video = await this.videoRepository.findOne({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(
        'El video no existe con el identificador proporcionado'
      );
    }

    return video;
  }

  async create(dto: CreateVideoDto) {
    const permalink = formatPermalinkOrSlug(
      dto.permalink !== undefined ? dto.permalink : dto.title,
    );

    if (!permalink) {
      throw new BadRequestException(
        'El enlace permanente no puede quedar vacío después de normalizarse'
      );
    }

    const existingVideo = await this.videoRepository.findOne({
      where: { permalink },
    });

    if (existingVideo) {
      throw new ConflictException(
        `El video con el enlace permanente [${permalink}] ya existe, elija otro título`
      );
    }

    try {
      const video = this.videoRepository.create({
        ...dto,
        permalink,
        active: dto.active ?? false,
      });
      await this.videoRepository.save(video);

      return {
        message: 'Video creado satisfactoriamente',
        video,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateVideoDto) {
    const video = await this.videoRepository.findOne({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(
        'El video no existe con el identificador proporcionado'
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

      if (permalink !== video.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    } else if (dto.title !== undefined) {
      const permalink = formatPermalinkOrSlug(dto.title);

      if (permalink !== video.permalink) {
        updateData.permalink = permalink;
        permalinkChanged = true;
      }
    }

    if (permalinkChanged) {
      const existingVideo = await this.videoRepository.findOne({
        where: { permalink: updateData.permalink },
      });

      if (existingVideo && existingVideo.id !== id) {
        throw new ConflictException(
          `El video con el enlace permanente [${updateData.permalink}] ya existe, elija otro permalink`
        );
      }
    }

    const updatedVideo = this.videoRepository.merge(video, updateData);

    try {
      await this.videoRepository.save(updatedVideo);

      return {
        message: 'Video actualizado exitosamente',
        video: updatedVideo,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const video = await this.videoRepository.findOne({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(
        'El video no existe con el identificador proporcionado'
      );
    }

    try {
      await this.videoRepository.remove(video);

      return {
        message: 'Video eliminado satisfactoriamente',
        video,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}