import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Sponsor } from './entities/sponsor.entity.js';
import { CreateSponsorDto } from './dto/create-sponsor.dto.js';
import { UpdateSponsorDto } from './dto/update-sponsor.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

export class SponsorsService {
  constructor(
    @InjectRepository(Sponsor)
    private sponsorRepository: Repository<Sponsor>,

    private commonService: CommonService,
  ) { }

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    const [sponsorsCount, sponsors] = await Promise.all([
      this.sponsorRepository.count(),
      this.sponsorRepository.find({ take, skip: (page - 1) * take }),
    ]);

    return {
      sponsors,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(sponsorsCount / take),
      },
    };
  }

  async findById(id: string) {
    const sponsor = await this.sponsorRepository.findOne({ where: { id } });

    if (!sponsor) {
      throw new NotFoundException(
        'El patrocinador no existe con el identificador proporcionado'
      );
    }

    return sponsor;
  }

  async create(dto: CreateSponsorDto) {
    const existingSponsor = await this.sponsorRepository.findOne({
      where: { name: dto.name },
    });

    if (existingSponsor) {
      throw new ConflictException(
        `El patrocinador con el nombre [${dto.name}] ya existe, elija otro`
      );
    }

    try {
      const sponsor = this.sponsorRepository.create(dto);
      await this.sponsorRepository.save(sponsor);
      return sponsor;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateSponsorDto) {
    const sponsor = await this.sponsorRepository.findOne({ where: { id } });

    if (!sponsor) {
      throw new NotFoundException(
        'El patrocinador no existe con el identificador proporcionado'
      );
    }

    const updatedSponsor = this.sponsorRepository.merge(sponsor, dto);

    try {
      await this.sponsorRepository.save(updatedSponsor);

      return {
        message: 'Patrocinador actualizado exitosamente',
        sponsor: updatedSponsor,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const sponsor = await this.sponsorRepository.findOne({ where: { id } });

    if (!sponsor) {
      throw new NotFoundException(
        'El patrocinador no existe con el identificador proporcionado'
      );
    }

    try {
      await this.sponsorRepository.remove(sponsor);

      return {
        message: 'Patrocinador eliminado satisfactoriamente',
        sponsor,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}