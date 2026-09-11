import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { UpdateUserDto, CreateUserDto } from './dto/index.js';
import { User } from './entities/user.entity.js';
import { CommonService } from '../common/common.service.js';
import { SearchParamsDto } from '../common/dto/search-params.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService,
  ) { }

  async findAll({ search_term, page = 1, take = 10 }: SearchParamsDto) {
    const where = search_term
      ? [
        { name: ILike(`%${search_term.toLocaleLowerCase()}%`) },
        { username: ILike(`%${search_term.toLocaleLowerCase()}%`) },
        { email: ILike(`%${search_term.toLocaleLowerCase()}%`) },
      ]
      : undefined;

    const [usersCount, users] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.find({
        where,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          emailVerified: true,
          imageUrl: true,
          roles: true,
          isActive: true,
        },
        take,
        skip: (page - 1) * take,
      }),
    ]);

    return {
      users,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(usersCount / take),
      },
    }
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        roles: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`)
    }

    return {
      user
    };
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          imageUrl: true,
          imagePublicId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException(
          `¡ No se encuentra el usuario con su nombre de usuario: [${username}], en la base de datos !`
        )
      }

      return user;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const { password, ...userData } = dto;

      const newUser = this.userRepository.create({
        email: userData.email,
        password: hashSync(password, 10),
        name: userData.name,
        username: userData.username,
        imageUrl: userData.imageUrl,
        imagePublicId: userData.imagePublicId,
      });

      await this.userRepository.save(newUser);

      return {
        message: 'Usuario creado satisfactoriamente 👍',
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          imageUrl: newUser.imageUrl,
          imagePublicId: newUser.imagePublicId,
          isActive: newUser.isActive,
          roles: newUser.roles,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new NotFoundException(
        `¡ El usuario con id: [${id}], no existe en la base de datos !`
      );
    }

    const { password, ...dtoWithoutPassword } = dto;

    const fields = Object.fromEntries(
      Object
        .entries(dtoWithoutPassword)
        .filter(([, value]) => value !== undefined)
    );

    if (password && !compareSync(password, user.password)) {
      fields.password = hashSync(password, 10);
    }

    const updatedUser = this.userRepository.merge(user, fields);

    try {
      await this.userRepository.save(updatedUser);

      const outputUser = Object.fromEntries(
        Object.entries(updatedUser).filter(entry => entry[0] !== 'password'),
      ) as Omit<User, 'password'>;

      return {
        message: 'Usuario actualizado exitosamente 👍',
        user: outputUser,
      }
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        imagePublicId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`);
    }

    try {
      await this.userRepository.delete({ id: user.id });

      return {
        message: 'Usuario eliminado satisfactoriamente 👍',
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}
