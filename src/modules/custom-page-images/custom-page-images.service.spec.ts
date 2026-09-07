import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { CustomPage } from '../custom-pages/entities/custom-page.entity.js';
import { CustomPageImagesService } from './custom-page-images.service.js';
import { CustomPageImage } from './entities/custom-page-image.entity.js';
import { CreateCustomPageImageDto } from './dto/create-custom-page-image.dto.js';

function buildService() {
  const customPageImageRepo = {
    createQueryBuilder: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    merge: vi.fn(),
    remove: vi.fn(),
  };
  const customPageRepo = {
    findOne: vi.fn(),
  };
  const commonService = {
    handleExceptions: vi.fn((error: unknown) => {
      throw error;
    }),
  };

  const service = new CustomPageImagesService(
    customPageImageRepo as unknown as Repository<CustomPageImage>,
    customPageRepo as unknown as Repository<CustomPage>,
    commonService as unknown as CommonService,
  );

  return { service, customPageImageRepo, customPageRepo, commonService };
}

function createCustomPageImageDto(
  overrides: Partial<CreateCustomPageImageDto> = {},
): CreateCustomPageImageDto {
  return {
    title: 'Imagen Principal',
    imageUrl: 'https://img.example.com/photo.jpg',
    imagePublicId: 'pages/photo',
    ...overrides,
  };
}

describe('CustomPageImagesService', () => {
  describe('create', () => {
    it('asocia la imagen a la página cuando la página existe', async () => {
      const { service, customPageRepo, customPageImageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue({ id: 'page-1', title: 'Página' });
      customPageImageRepo.create.mockImplementation(
        (data: CreateCustomPageImageDto) => data,
      );
      customPageImageRepo.save.mockResolvedValue({ id: 'img-1' });

      await service.create('page-1', createCustomPageImageDto());

      expect(customPageImageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Imagen Principal',
          parentPage: { id: 'page-1' },
        }),
      );
    });

    it('lanza NotFoundException cuando la página no existe', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create('page-inexistente', createCustomPageImageDto()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('devuelve solo las imágenes de la página, ordenadas por creación ascendente, y pagina', async () => {
      const { service, customPageRepo, customPageImageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue({ id: 'page-1' });

      const customPageImages = [{ id: 'a' }, { id: 'b' }];
      const dataBuilder = {
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(customPageImages),
      };
      const countBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn().mockResolvedValue(2),
      };

      customPageImageRepo.createQueryBuilder
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(dataBuilder);

      const result = await service.findAll('page-1', { page: 1, take: 10 });

      expect(dataBuilder.where).toHaveBeenCalledWith(
        'customPageImage.parentPage = :pageId',
        { pageId: 'page-1' },
      );
      expect(dataBuilder.orderBy).toHaveBeenCalledWith(
        'customPageImage.createdAt',
        'ASC',
      );
      expect(result).toEqual({
        customPageImages,
        pagination: { currentPage: 1, totalPages: 1 },
      });
    });

    it('lanza NotFoundException cuando la página no existe', async () => {
      const { service, customPageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findAll('page-inexistente', { page: 1, take: 10 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('lanza NotFoundException cuando la imagen no existe en la página', async () => {
      const { service, customPageRepo, customPageImageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue({ id: 'page-1' });
      customPageImageRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findById('page-1', 'id-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });

    it('devuelve la imagen sin incluir la página anidada', async () => {
      const { service, customPageRepo, customPageImageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue({ id: 'page-1' });
      customPageImageRepo.findOne.mockResolvedValue({
        id: 'img-1',
        title: 'Imagen Principal',
        parentPage: { id: 'page-1', title: 'Página' },
      });

      const result = await service.findById('page-1', 'img-1');

      expect(result).toEqual({
        id: 'img-1',
        title: 'Imagen Principal',
      });
      expect(result).not.toHaveProperty('parentPage');
    });
  });

  describe('update', () => {
    it('fusiona los cambios y devuelve la imagen actualizada sin la página', async () => {
      const { service, customPageRepo, customPageImageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue({ id: 'page-1' });
      const existing = {
        id: 'img-1',
        title: 'Imagen Principal',
        imageUrl: 'https://img.example.com/photo.jpg',
        parentPage: { id: 'page-1', title: 'Página' },
      };
      customPageImageRepo.findOne.mockResolvedValue(existing);
      customPageImageRepo.merge.mockImplementation(
        (base: CustomPageImage, data: Partial<CustomPageImage>) => ({
          ...base,
          ...data,
        }),
      );
      customPageImageRepo.save.mockResolvedValue({
        ...existing,
        title: 'Imagen Secundaria',
      });

      const result = await service.update('page-1', 'img-1', {
        title: 'Imagen Secundaria',
      });

      expect(result).toEqual({
        message: expect.stringContaining('actualizada'),
        customPageImage: {
          id: 'img-1',
          title: 'Imagen Secundaria',
          imageUrl: 'https://img.example.com/photo.jpg',
        },
      });
      expect(result.customPageImage).not.toHaveProperty('parentPage');
    });
  });

  describe('remove', () => {
    it('elimina la imagen y confirma la eliminación', async () => {
      const { service, customPageRepo, customPageImageRepo } = buildService();

      customPageRepo.findOne.mockResolvedValue({ id: 'page-1' });
      const existing = { id: 'img-1' };
      customPageImageRepo.findOne.mockResolvedValue(existing);
      customPageImageRepo.remove.mockResolvedValue(existing);

      const result = await service.remove('page-1', 'img-1');

      expect(customPageImageRepo.remove).toHaveBeenCalledWith(existing);
      expect(result).toEqual({
        message: expect.stringContaining('eliminada'),
      });
    });
  });
});