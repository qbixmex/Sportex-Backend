import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFieldDto, UpdateFieldDto } from './dto/index.js';
import { Field } from './entities/field.entity.js';
import { FieldTeam } from './entities/field-team.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { isUUID } from 'class-validator';
import { CommonService } from '../common/common.service.js';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,

    @InjectRepository(FieldTeam)
    private readonly fieldTeamRepository: Repository<FieldTeam>,

    private readonly commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    try {
      const [fieldsRaw, fieldsCount] = await Promise.all([
         this.fieldRepository.find({
          take,
          skip: (page - 1) *take,
          relations: {
            fieldTeams: { team: true },
          },
          select: {
            fieldTeams: {
              fieldId: true,
              teamId: true,
              team: { id: true },
            },
          },
        }),
        this.fieldRepository.count(),
      ]);

      const fields = fieldsRaw.map(({ fieldTeams, ...field }: Field & {
        fieldTeams?: {
          fieldId: string;
          teamId: string;
          team: { id: string; };
        }[];
      }) => ({
        ...field,
        teamsCount: fieldTeams.length,
      }));

      return {
        fields,
        pagination: {
          currentPage: +page,
          totalPages: Math.ceil(fieldsCount / take),
        },
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findById(id: string) {
    const fieldRaw = await this.fieldRepository.findOne({
      where: isUUID(id) ? { id } : { permalink: id.toLowerCase() },
      relations: {
        fieldTeams: {
          team: true,
        },
      },
      select: {
        fieldTeams: {
          fieldId: true,
          teamId: true,
          team: {
            id: true,
            name: true,
            permalink: true,
          },
        },
      },
    });

    if (!fieldRaw) {
      throw new NotFoundException('La cancha no existe con el identificador proporcionado');
    }

    const { fieldTeams, ...field } = fieldRaw;

    return {
      field,
      teams: fieldTeams.map((ft: FieldTeam) => ({ ...ft.team })),
    };
  }

  async create(dto: CreateFieldDto) {
    if (dto.permalink) {
      const permalinkCount = await this.fieldRepository.count({
        where: { permalink: dto.permalink },
      });

      if (permalinkCount > 0) {
        throw new BadRequestException(
          `La cancha con el enlace permanente (${dto.permalink}) ya existe, elija otro`
        );
      }
    }

    try {
      const { teamsIds, ...fieldData } = dto;
      const newField = this.fieldRepository.create(fieldData);

      await this.fieldRepository.save(newField);

      if (teamsIds !== undefined && newField.id) {
        await this.fieldTeamRepository.delete({ fieldId: newField.id });
        if (teamsIds.length > 0) {
          const newRelations = teamsIds.map((teamId: string) =>
            this.fieldTeamRepository.create({ fieldId: newField.id!, teamId })
          );
          await this.fieldTeamRepository.save(newRelations);
        }
      }

      return {
        message: 'Cancha creada satisfactoriamente',
        data: newField,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateFieldDto) {
    const field = await this.fieldRepository.findOne({
      where: { id },
    });

    if (!field) {
      throw new NotFoundException(
        'La cancha no existe con el identificador proporcionado'
      );
    }

    if (dto.permalink) {
      const permalinkCount = await this.fieldRepository.count({
        where: { permalink: dto.permalink },
      });

      if (permalinkCount > 0) {
        throw new BadRequestException(
          `La cancha con el enlace permanente (${dto.permalink}) ya existe, elija otro`
        );
      }
    }

    const { teamsIds, ...fieldData } = dto;
    const updatedField = this.fieldRepository.merge(field, fieldData);

    try {
      await this.fieldRepository.save(updatedField);

      if (teamsIds !== undefined) {
        await this.fieldTeamRepository.delete({ fieldId: id });

        if (teamsIds.length > 0) {
          const newRelations = teamsIds.map((teamId: string) =>
            this.fieldTeamRepository.create({ fieldId: id, teamId })
          );

          await this.fieldTeamRepository.save(newRelations);
        }
      }

      return {
        message: 'Cancha actualizada exitosamente',
        data: updatedField,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const field = await this.fieldRepository.findOne({
      where: { id },
    });

    if (!field) {
      throw new NotFoundException(
        'La cancha no existe con el identificador proporcionado'
      );
    }

    try {
      await this.fieldTeamRepository.delete({ fieldId: id });
      await this.fieldRepository.delete({ id: field.id });

      return {
        message: 'Cancha eliminada satisfactoriamente',
        data: field,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}
