import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/index.js';
import { Player } from './entities/player.entity.js';
import { Team } from '../teams/entities/team.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { CommonService } from '../common/common.service.js';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    private readonly commonService: CommonService,
  ) {}

  async findAll({ page = 1, take = 10 }: PaginationDto) {
    try {
      const [playersCount, players] = await Promise.all([
        this.playerRepository.count(),
        this.playerRepository.find({
          take,
          skip: (page - 1) * take,
          relations: { team: true },
          select: {
            team: {
              id: true,
              name: true,
              permalink: true,
            },
          }
        }),
      ]);

      return {
        players,
        pagination: {
          currentPage: +page,
          totalPages: Math.ceil(playersCount / take),
        },
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findById(id: string) {   
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: { team: true },
      select: {
        team: {
          id: true,
          name: true,
          permalink: true,
        },
      },
    });

    if (!player) {
      throw new NotFoundException(
        'El jugador no existe con el identificador proporcionado'
      );
    }

    return player;
  }

  async create(dto: CreatePlayerDto) {
    if (dto.teamId) {
      await this.ensureTeamExists(dto.teamId);
    }

    try {
      const newPlayer = this.playerRepository.create({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
        nationality: dto.nationality,
        imageUrl: dto.imageUrl,
        imagePublicId: dto.imagePublicId,
        active: dto.active,
        team: dto.teamId ? { id: dto.teamId } : undefined,
      });

      await this.playerRepository.save(newPlayer);

      return {
        message: 'Jugador creado satisfactoriamente',
        data: newPlayer,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdatePlayerDto) {
    const player = await this.playerRepository.findOne({ where: { id } });

    if (!player) {
      throw new NotFoundException(
        'El jugador no existe con el identificador proporcionado'
      );
    }

    if (dto.teamId !== undefined) {
      if (dto.teamId) {
        await this.ensureTeamExists(dto.teamId);
        player.team = { id: dto.teamId } as Team;
      } else {
        player.team = undefined as unknown as Team;
      }
    }

    if (dto.birthday !== undefined) {
      player.birthday = dto.birthday ? new Date(dto.birthday) : undefined;
    }

    const updatedPlayer = this.playerRepository.merge(player, dto);

    try {
      await this.playerRepository.save(updatedPlayer);

      return {
        message: 'Jugador actualizado exitosamente',
        player: updatedPlayer,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const player = await this.playerRepository.findOne({ where: { id } });

    if (!player) {
      throw new NotFoundException(
        'El jugador no existe con el identificador proporcionado'
      );
    }

    try {
      await this.playerRepository.delete({ id: player.id });

      return {
        message: 'Jugador eliminado satisfactoriamente',
        data: player,
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  private async ensureTeamExists(teamId: string) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });

    if (!team) {
      throw new BadRequestException(
        'El equipo no existe con el identificador proporcionado'
      );
    }
  }
}
