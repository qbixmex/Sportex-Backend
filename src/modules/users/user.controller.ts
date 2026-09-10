import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  Version,
  Query,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/index.js';
import { UserService } from './user.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { VALID_ROLES } from '../auth/enums/index.js';
import { SearchParamsDto } from '../common/dto/search-params.dto.js';

@Controller('users')
@Auth(VALID_ROLES.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get()
  getUsers(@Query() searchParamsDto: SearchParamsDto) {
    return this.userService.findAll(searchParamsDto);
  }

  @Version('1')
  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  @Version('1')
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Version('1')
  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Version('1')
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
