import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginUserDto, RegisterUserDto } from './dto/index.js';
import { GetUser } from './decorators/get-user.decorator.js';
import { VALID_ROLES } from './enums/index.js';
import { Auth } from './decorators/auth.decorator.js';
import { User } from '../../modules/users/entities/user.entity.js';
import { Auth as AuthEntity } from './entities/auth.entity.js';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Version('1')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acceder con credenciales de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario autentificado exitosamente', type: AuthEntity })
  @ApiResponse({ status: 401, description: 'Las credenciales son incorrectas' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Version('1')
  @Get('check-status')
  @Auth(VALID_ROLES.USER, VALID_ROLES.ADMIN)
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}
