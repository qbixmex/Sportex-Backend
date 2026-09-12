import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoachDto, UpdateCoachDto } from './dto/index.js';
import { Coach } from './entities/coach.entity.js';
import { Team } from '../teams/entities/team.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { CommonService } from '../common/common.service.js';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    private readonly commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    try {
      const [coachesCount, coaches] = await Promise.all([
        this.coachRepository.count(),
        this.coachRepository.find({
          take,
          skip: (page - 1) * take,
          relations: { teams: true },
          select: {
            teams: {
              id: true,
              name: true,
            },
          },
        }),
      ]);

      return {
        coaches,
        pagination: {
          currentPage: +page,
          totalPages: Math.ceil(coachesCount / take),
        },
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findById(id: string) {
    const coach = await this.coachRepository.findOne({
      where: { id },
      relations: { teams: true },
      select: {
        teams: {
          id: true,
          name: true,
        },
      },
    });

    if (!coach) {
      throw new NotFoundException(
        'El entrenador no existe con el identificador proporcionado'
      );
    }

    return coach;
  }

  async create(dto: CreateCoachDto) {
    try {
      const newCoach = this.coachRepository.create(dto);

      const savedCoach = await this.coachRepository.save(newCoach);

      if (dto.teamIds !== undefined) {
        await this.ensureTeamsExist(dto.teamIds);
        await this.assignTeamsToCoach(savedCoach.id, dto.teamIds);
      }

      return {
        message: 'Entrenador creado satisfactoriamente',
        data: savedCoach,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateCoachDto) {
    const coach = await this.coachRepository.findOne({ where: { id } });

    if (!coach) {
      throw new NotFoundException(
        'El entrenador no existe con el identificador proporcionado'
      );
    }

    const updatedCoach = this.coachRepository.merge(coach, dto);

    try {
      const savedCoach = await this.coachRepository.save(updatedCoach);

      if (dto.teamIds !== undefined) {
        await this.ensureTeamsExist(dto.teamIds);
        await this.syncTeamsForCoach(savedCoach.id, dto.teamIds);
      }

      return {
        message: 'Entrenador actualizado exitosamente',
        data: savedCoach,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const coach = await this.coachRepository.findOne({ where: { id } });

    if (!coach) {
      throw new NotFoundException(
        'El entrenador no existe con el identificador proporcionado'
      );
    }

    try {
      const linked = await this.teamRepository.find({
        where: { coach: { id: coach.id } },
      });

      for (const team of linked) {
        team.coach = null;
        await this.teamRepository.save(team);
      }

      await this.coachRepository.delete({ id: coach.id });

      return {
        message: 'Entrenador eliminado satisfactoriamente',
        data: coach,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  private async ensureTeamsExist(teamIds: string[]) {
    const teams = await this.teamRepository.find({
      where: { id: In(teamIds) },
    });

    if (teams.length !== teamIds.length) {
      throw new BadRequestException('Algunos de los equipos seleccionados no existen');
    }
  }

  private async assignTeamsToCoach(coachId: string, teamIds: string[]) {
    if (teamIds.length === 0) {
      return;
    }

    const coach = this.coachRepository.create({ id: coachId });
    await this.teamRepository.save(
      teamIds.map((id) => ({ id, coach }) as DeepPartial<Team>)
    );
  }

  private async syncTeamsForCoach(coachId: string, teamIds: string[]) {
    const current = await this.teamRepository.find({
      where: { coach: { id: coachId } },
    });

    const keptIds = new Set(teamIds);
    const toUnlink = current.filter((team) => !keptIds.has(team.id));

    for (const team of toUnlink) {
      team.coach = null;
      await this.teamRepository.save(team);
    }

    await this.assignTeamsToCoach(coachId, teamIds);
  }
}
