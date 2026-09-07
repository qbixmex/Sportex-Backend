import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { HeroBanner } from './entities/hero-banner.entity.js';
import { CreateHeroBannerDto, UpdateHeroBannerDto } from './dto/index.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

export class HeroBannersService {
  constructor(
    @InjectRepository(HeroBanner)
    private heroBannerRepository: Repository<HeroBanner>,

    private commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    const [heroBannersCount, heroBanners] = await Promise.all([
      this.heroBannerRepository.count(),
      this.heroBannerRepository.find({ take, skip: (page - 1) * take }),
    ]);

    return {
      heroBanners,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(heroBannersCount / take),
      },
    };
  }

  async findById(id: string) {
    const heroBanner = await this.heroBannerRepository.findOne({ where: { id } });

    if (!heroBanner) {
      throw new NotFoundException(
        `¡ El banner con id: [${id}], no existe en la base de datos !`
      );
    }

    return heroBanner;
  }

  async create(dto: CreateHeroBannerDto) {
    const existingHeroBanner = await this.heroBannerRepository.findOne({
      where: { title: dto.title },
    });

    if (existingHeroBanner) {
      throw new ConflictException(
        `¡ El banner con el título [${dto.title}] ya existe, elija otro !`
      );
    }

    try {
      const heroBanner = this.heroBannerRepository.create(dto);
      await this.heroBannerRepository.save(heroBanner);
      return {
        message: '¡ El banner se ha creado correctamente 👍 !',
        heroBanner,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateHeroBannerDto) {
    const heroBanner = await this.heroBannerRepository.findOne({ where: { id } });

    if (!heroBanner) {
      throw new NotFoundException(
        `¡ El banner con id: [${id}], no existe en la base de datos !`
      );
    }

    if (dto.title && dto.title !== heroBanner.title) {
      const existingHeroBanner = await this.heroBannerRepository.findOne({
        where: { title: dto.title },
      });

      if (existingHeroBanner) {
        throw new ConflictException(
          `¡ El banner con el título [${dto.title}] ya existe, elija otro !`
        );
      }
    }

    const updatedHeroBanner = this.heroBannerRepository.merge(heroBanner, dto);

    try {
      await this.heroBannerRepository.save(updatedHeroBanner);

      return {
        message: 'El banner ha sido actualizado correctamente 👍',
        heroBanner: updatedHeroBanner,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const heroBanner = await this.heroBannerRepository.findOne({ where: { id } });

    if (!heroBanner) {
      throw new NotFoundException(
        `¡ El banner con el id [${id}], no existe en la base de datos !`
      );
    }

    try {
      await this.heroBannerRepository.remove(heroBanner);

      return {
        message: 'El Banner ha sido eliminado correctamente 👍',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}