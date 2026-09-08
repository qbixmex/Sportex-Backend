import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTournamentDto, UpdateTournamentDto } from './dto/index.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { validate as isUUID } from 'uuid';
import { CommonService } from '../common/common.service.js';
import type { ResponseTournamentList, TOURNAMENT_TYPE } from './types/tournament_list.type.ts';
import type { FetchTournamentResponse } from './types/tournament.type.ts';
import type { CreateTournamentResponse } from './types/tournament_create.type.ts';
import type { UpdateTournamentResponse } from './types/tournament_update.type.ts';
import type { DeleteTournamentResponse } from './types/tournament_remove.type.ts';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly commonService: CommonService,
  ) { }

  async findAll({ page = 1, take = 10 }: PaginationDto): Promise<ResponseTournamentList> {
    try {
      const [tournamentsData, tournamentsCount] = await this.tournamentRepository.findAndCount({
        take,
        skip: (page - 1) * take,
        select: {
          id: true,
          name: true,
          permalink: true,
          imageUrl: true,
          season: true,
          startDate: true,
          endDate: true,
          active: true,
        },
      });

      const categoryCounts = await this.tournamentRepository
        .createQueryBuilder('tournament')
        .leftJoin('tournament.categories', 'category')
        .select('tournament.id', 'tournamentId')
        .addSelect('COUNT(category.id)', 'count')
        .where('tournament.id IN (:...ids)', { ids: tournamentsData.map((t) => t.id) })
        .groupBy('tournament.id')
        .getRawMany();

      const countByTournamentId = new Map(
        categoryCounts.map((c) => [c.tournamentId, Number(c.count)])
      );

      const tournaments: TOURNAMENT_TYPE[] = tournamentsData.map((tournament) => {
        return {
          id: tournament.id,
          name: tournament.name,
          permalink: tournament.permalink,
          imageUrl: tournament.imageUrl,
          stage: tournament.stage,
          season: tournament.season,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          active: tournament.active,
          categoriesQuantity: countByTournamentId.get(tournament.id) ?? 0,
        };
      });

      return {
        tournaments,
        pagination: {
          currentPage: +page,
          totalPages: Math.ceil(tournamentsCount / take),
        },
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findById(id: string): Promise<FetchTournamentResponse> {
    const queryBuilder = this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoin('tournament.categories', 'category')
      .addSelect(['category.id', 'category.name', 'category.permalink']);

    if (isUUID(id)) {
      queryBuilder.where('tournament.id = :id', { id });
    } else {
      queryBuilder.where('tournament.permalink = :permalink', {
        permalink: id.toLowerCase(),
      });
    }

    const tournament = await queryBuilder.getOne();

    if (!tournament) {
      throw new NotFoundException(
        '¡ El torneo con '
         + (isUUID(id) ? 'id ' : 'enlace permanente ')
         + `[${id}] no existe en la base de datos !`
      );
    }

    const teamsCountRow = await this.tournamentRepository
      .createQueryBuilder('tournament')
      .innerJoin('tournament.teams', 'team')
      .select('COUNT(team.id)', 'total')
      .where('tournament.id = :tournamentId', { tournamentId: id })
      .getRawOne<{ total: string }>();

    return {
      tournament: {
        ...tournament,
        teamsQuantity: Number(teamsCountRow?.total ?? 0),
      },
    };
  }

  async create(dto: CreateTournamentDto): Promise<CreateTournamentResponse> {
    const tournamentNameCount = await this.tournamentRepository.count({
      where: { name: dto.name },
    });

    if (tournamentNameCount > 0) {
      throw new BadRequestException(
        `¡ El torneo con el nombre (${dto.name}) ya existe, elija otro !`
      );
    }

    if (dto.permalink) {
      const tournamentPermalinkCount = await this.tournamentRepository.count({
        where: { permalink: dto.permalink },
      });

      if (tournamentPermalinkCount > 0) {
        throw new BadRequestException(
          `¡ El torneo con el nombre permanente (${dto.permalink}) ya existe, elija otro !`
        );
      }
    }

    try {
      const newTournament = this.tournamentRepository.create(dto);

      await this.tournamentRepository.save(newTournament);

      return {
        message: '¡ Torneo creado satisfactoriamente 👍 !',
        tournament: newTournament,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateTournamentDto): Promise<UpdateTournamentResponse> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(
        `¡ El torneo con id: [${id}], no existe en la base de datos !`
      );
    }

    const updatedTournament = this.tournamentRepository.merge(tournament, dto);

    try {
      await this.tournamentRepository.save(updatedTournament);

      return {
        message: 'Torneo actualizado exitosamente 👍',
        tournament: updatedTournament,
      }
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<DeleteTournamentResponse> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(
        `El torneo con id: [${id}], no existe en la base de datos`
      );
    }

    try {
      await this.tournamentRepository.delete({ id: tournament.id });

      return {
        message: 'Torneo eliminado satisfactoriamente 👍',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}
