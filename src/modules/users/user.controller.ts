import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Version,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UsersResponseDto,
  UserCreateResponseDto,
  UserUpdateResponseDto,
  UserDeleteResponseDto,
} from './dto/index.js';
import { UserService } from './user.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { VALID_ROLES } from '../auth/enums/index.js';
import { SearchParamsDto } from '../common/dto/search-params.dto.js';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { ParseUUIDEsPipe } from '../common/pipes/parse-uuid-es.pipe.js';
import {
  BAD_REQUEST_CREATE_ERROR,
  BAD_REQUEST_SEARCH_ERROR,
  BAD_REQUEST_UUID_ERROR,
  CONFLICT_ERROR,
  FORBIDDEN_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  UNAUTHORIZED_ERROR,
} from './swagger/error-examples.js';

@Auth(VALID_ROLES.ADMIN)
@ApiBearerAuth('token')
@ApiTags('Users')
@ApiUnauthorizedResponse({
  type: ErrorResponseDto,
  description: 'Token inválido o usuario inactivo',
  example: UNAUTHORIZED_ERROR,
})
@ApiForbiddenResponse({
  type: ErrorResponseDto,
  description: 'Rol sin permisos para realizar la acción',
  example: FORBIDDEN_ERROR,
})
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get()
  @ApiOperation({ summary: 'Devuelve usuarios' })
  @ApiOkResponse({ type: UsersResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Parámetros de búsqueda o paginación inválidos',
    example: BAD_REQUEST_SEARCH_ERROR,
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Error interno del servidor',
    example: INTERNAL_SERVER_ERROR,
  })
  getUsers(@Query() searchParamsDto: SearchParamsDto) {
    return this.userService.findAll(searchParamsDto);
  }

  @Version('1')
  @Get(':id')
  @ApiOperation({ summary: 'Devuelve un usuario por id' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'El id no es un UUID válido',
    example: BAD_REQUEST_UUID_ERROR,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'No existe un usuario con ese id',
    example: NOT_FOUND_ERROR,
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Error interno del servidor',
    example: INTERNAL_SERVER_ERROR,
  })
  getUserById(@Param('id', ParseUUIDEsPipe) id: string) {
    return this.userService.findById(id);
  }

  @Version('1')
  @Post()
  @ApiOperation({ summary: 'Crea un usuario nuevo' })
  @ApiCreatedResponse({ type: UserCreateResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Datos del cuerpo inválidos o error de base de datos por duplicado de columna',
    example: BAD_REQUEST_CREATE_ERROR,
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Ya existe un usuario con ese email',
    example: CONFLICT_ERROR,
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Error interno del servidor',
    example: INTERNAL_SERVER_ERROR,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Version('1')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un usuario' })
  @ApiOkResponse({ type: UserUpdateResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'El id no es un UUID válido o los datos del cuerpo son inválidos',
    example: BAD_REQUEST_UUID_ERROR,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'No existe un usuario con ese id',
    example: NOT_FOUND_ERROR,
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Error interno del servidor',
    example: INTERNAL_SERVER_ERROR,
  })
  updateUser(
    @Param('id', ParseUUIDEsPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Version('1')
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un usuario' })
  @ApiOkResponse({ type: UserDeleteResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'El id no es un UUID válido',
    example: BAD_REQUEST_UUID_ERROR,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'No existe un usuario con ese id',
    example: NOT_FOUND_ERROR,
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponseDto,
    description: 'Error interno del servidor',
    example: INTERNAL_SERVER_ERROR,
  })
  deleteUser(@Param('id', ParseUUIDEsPipe) id: string) {
    return this.userService.delete(id);
  }
}