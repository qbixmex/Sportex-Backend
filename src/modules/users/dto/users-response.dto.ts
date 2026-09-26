import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto.js';
import { UserDto } from './user.dto.js';

export class UsersResponseDto {
  @ApiProperty({
    type: UserDto,
    isArray: true,
    description: 'Lista de usuarios',
  })
  users!: UserDto[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Metadatos de paginación',
  })
  pagination!: PaginationMetaDto;
}