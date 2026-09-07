import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { CustomPagesService } from './custom-pages.service.js';
import { CustomPage } from './entities/custom-page.entity.js';
import { CreateCustomPageDto } from './dto/create-custom-page.dto.js';

function buildService() {
  const customPageRepo = {
    createQueryBuilder: vi.fn(),
    findOne: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    merge: vi.fn(),
    remove: vi.fn(),
  };
  const commonService = {
    handleExceptions: vi.fn((error: unknown) => {
      throw error;
    }),
  };

  const service = new CustomPagesService(
    customPageRepo as unknown as Repository<CustomPage>,
    commonService as unknown as CommonService,
  );

  return { service, customPageRepo, commonService };
}

function createCustomPageDto(
  overrides: Partial<CreateCustomPageDto> = {},
): CreateCustomPageDto {
  return {
    title: 'Nosotros',
    permalink: 'nosotros',
    ...overrides,
  };
}

describe('CustomPagesService', () => {
  describe('create', () => {
    it('normaliza el enlace permanente y aplica estado borrador y seo_robots por omisión', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.count.mockResolvedValue(0);
      customPageRepo.create.mockImplementation(
        (data: CreateCustomPageDto) => data,
      );
      customPageRepo.save.mockResolvedValue({
        id: 'page-1',
        permalink: 'nosotros',
        status: 'draft',
        seoRobots: 'noindex, nofollow',
      });

      const result = await service.create(
        createCustomPageDto({ permalink: 'Nosotros' }),
      );

      expect(customPageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          permalink: 'nosotros',
          status: 'draft',
          seoRobots: 'noindex, nofollow',
        }),
      );
      expect(result).toEqual({
        message: expect.stringContaining('creada'),
        customPage: expect.objectContaining({
          permalink: 'nosotros',
        }),
      });
    });

    it('lanza ConflictException cuando el enlace permanente ya existe', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.count.mockResolvedValue(1);

      await expect(
        service.create(createCustomPageDto()),
      ).rejects.toThrow(ConflictException);
    });

    it('deja el enlace permanente sin normalizar para que la entidad lo derive del título', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.count.mockResolvedValue(0);
      customPageRepo.create.mockImplementation(
        (data: CreateCustomPageDto) => data,
      );
      customPageRepo.save.mockResolvedValue({
        id: 'page-2',
        permalink: undefined,
        status: 'draft',
        seoRobots: 'noindex, nofollow',
      });

      const result = await service.create(
        createCustomPageDto({ permalink: undefined as unknown as string }),
      );

      expect(customPageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          permalink: undefined,
        }),
      );
      expect(result).toEqual({
        message: expect.stringContaining('creada'),
        customPage: expect.objectContaining({
          permalink: undefined,
        }),
      });
    });
  });

  describe('findAll', () => {
    it('ordena por posición ascendente y luego por fecha de creación, y pagina', async () => {
      const { service, customPageRepo } = buildService();

      const customPages = [{ id: 'a' }, { id: 'b' }];
      const dataBuilder = {
        orderBy: vi.fn().mockReturnThis(),
        addOrderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(customPages),
      };
      const countBuilder = {
        getCount: vi.fn().mockResolvedValue(2),
      };

      customPageRepo.createQueryBuilder
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(dataBuilder);

      const result = await service.findAll({ page: 1, take: 10 });

      expect(dataBuilder.orderBy).toHaveBeenCalledWith(
        'customPage.position',
        'ASC',
      );
      expect(dataBuilder.addOrderBy).toHaveBeenCalledWith(
        'customPage.createdAt',
        'ASC',
      );
      expect(result).toEqual({
        customPages,
        pagination: { currentPage: 1, totalPages: 1 },
      });
    });
  });

  describe('findById', () => {
    it('devuelve la página incluyendo sus imágenes', async () => {
      const { service, customPageRepo } = buildService();

      const customPage = {
        id: 'page-1',
        title: 'Nosotros',
        images: [{ id: 'img-1' }],
      };
      customPageRepo.findOne.mockResolvedValue(customPage);

      const result = await service.findById('page-1');

      expect(customPageRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'page-1' },
        relations: { images: true },
      });
      expect(result).toEqual(customPage);
    });

    it('lanza NotFoundException cuando la página no existe', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('page-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findPublishedAll', () => {
    it('solo devuelve páginas publicadas con proyección de datos públicos', async () => {
      const { service, customPageRepo } = buildService();

      const customPages = [{ id: 'page-1', title: 'Nosotros' }];
      const dataBuilder = {
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        addOrderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(customPages),
      };
      const countBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn().mockResolvedValue(1),
      };

      customPageRepo.createQueryBuilder
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(dataBuilder);

      const result = await service.findPublishedAll({ page: 1, take: 10 });

      expect(dataBuilder.where).toHaveBeenCalledWith(
        'customPage.status = :status',
        { status: 'published' },
      );
      expect(dataBuilder.select).toHaveBeenCalledWith([
        'customPage.id',
        'customPage.title',
        'customPage.permalink',
        'customPage.position',
        'customPage.seoTitle',
        'customPage.seoDescription',
      ]);
      expect(dataBuilder.orderBy).toHaveBeenCalledWith(
        'customPage.position',
        'ASC',
      );
      expect(result).toEqual({
        customPages,
        pagination: { currentPage: 1, totalPages: 1 },
      });
    });
  });

  describe('findPublishedByPermalink', () => {
    it('lanza NotFoundException cuando la página no está publicada o no existe', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findPublishedByPermalink('borrador'),
      ).rejects.toThrow(NotFoundException);

      expect(customPageRepo.findOne).toHaveBeenCalledWith({
        where: {
          permalink: 'borrador',
          status: 'published',
        },
        relations: { images: true },
      });
    });

    it('devuelve la página publicada con sus imágenes', async () => {
      const { service, customPageRepo } = buildService();

      const customPage = {
        id: 'page-1',
        permalink: 'nosotros',
        images: [{ id: 'img-1' }],
      };
      customPageRepo.findOne.mockResolvedValue(customPage);

      const result = await service.findPublishedByPermalink('Nosotros');

      expect(result).toEqual(customPage);
    });
  });

  describe('update', () => {
    it('lanza ConflictException cuando el nuevo enlace permanente ya existe', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue({
        id: 'page-1',
        permalink: 'nosotros',
      });
      customPageRepo.count.mockResolvedValue(1);

      await expect(
        service.update('page-1', { permalink: 'historia' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('elimina la página y confirma la eliminación', async () => {
      const { service, customPageRepo } = buildService();

      const existing = { id: 'page-1' };
      customPageRepo.findOne.mockResolvedValue(existing);
      customPageRepo.remove.mockResolvedValue(existing);

      const result = await service.remove('page-1');

      expect(customPageRepo.remove).toHaveBeenCalledWith(existing);
      expect(result).toEqual({
        message: expect.stringContaining('eliminada'),
      });
    });
  });
});