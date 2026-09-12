import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    example: 1,
    description: 'Página actual',
  })
  currentPage!: number;

  @ApiProperty({
    example: 5,
    description: 'Total de páginas',
  })
  totalPages!: number;
}