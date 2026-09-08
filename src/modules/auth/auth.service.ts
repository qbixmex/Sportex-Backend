import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { RegisterUserDto, LoginUserDto } from './dto/index.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { CommonService } from '../common/common.service.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
  ) { }

  async register(dto: RegisterUserDto) {
    try {
      const { password, ...userData } = dto;

      const newUser = this.userRepository.create({
        email: userData.email,
        password: hashSync(password, 10),
      });

      await this.userRepository.save(newUser);

      return {
        message: 'El registro fue realizado exitosamente 👍',
        token: this.getJwtToken({ id: newUser.id }),
      };
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
        imageUrl: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('¡ Las credenciales son incorrectas !');
    }

    const passwordsMatches = compareSync(dto.password, user.password);

    if (!passwordsMatches) {
      throw new UnauthorizedException('¡ Las credenciales son incorrectas !');
    }

    const userWithoutPassword = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password')
    );

    return {
      message: 'Usuario autentificado satisfactoriamente 👍🎉',
      user: userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  checkStatus(user: User) {
    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }
}
