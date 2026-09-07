import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';
import { UpdateContactMessageReadDto } from './dto/update-contact-message-read.dto.js';
import { ContactMessagesService } from './contact-messages.service.js';
import { ContactMessage } from './entities/contact-message.entity.js';

function buildService() {
  const repo = {
    createQueryBuilder: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };
  const commonService = {
    handleExceptions: vi.fn((error: unknown) => {
      throw error;
    }),
  };

  const service = new ContactMessagesService(
    repo as unknown as Repository<ContactMessage>,
    commonService as unknown as CommonService,
  );

  return { service, repo, commonService };
}

function createContactMessageDto(
  overrides: Partial<CreateContactMessageDto> = {},
): CreateContactMessageDto {
  return {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    message: 'Me interesa el torneo de fútbol',
    ...overrides,
  };
}

function readDto(overrides: Partial<UpdateContactMessageReadDto> = {}): UpdateContactMessageReadDto {
  return {
    read: true,
    ...overrides,
  };
}

describe('ContactMessagesService', () => {
  describe('create', () => {
    it('crea el mensaje en estado no leído por defecto', async () => {
      const { service, repo } = buildService();

      repo.create.mockImplementation((data: CreateContactMessageDto) => data);
      repo.save.mockResolvedValue({ id: 'uuid-1', read: false });

      const result = await service.create(createContactMessageDto());

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ read: false }),
      );
      expect(result).toEqual({
        message: expect.stringContaining('enviado'),
      });
    });
  });

  describe('findAll', () => {
    it('ordena por fecha de recepción de más recientes a más antiguos y pagina', async () => {
      const { service, repo } = buildService();

      const contactMessages = [{ id: 'a' }, { id: 'b' }];
      const dataBuilder = {
        orderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(contactMessages),
      };
      const countBuilder = {
        getCount: vi.fn().mockResolvedValue(2),
      };

      repo.createQueryBuilder
        .mockReturnValueOnce(countBuilder)
        .mockReturnValueOnce(dataBuilder);

      const result = await service.findAll({ page: 1, take: 10 });

      expect(dataBuilder.orderBy).toHaveBeenCalledWith(
        'contactMessage.createdAt',
        'DESC',
      );
      expect(result).toEqual({
        contactMessages,
        pagination: { currentPage: 1, totalPages: 1 },
      });
    });
  });

  describe('findById', () => {
    it('lanza NotFoundException cuando el mensaje no existe', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue(null);

      await expect(service.findById('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateRead', () => {
    it('actualiza el estado de lectura a leído', async () => {
      const { service, repo } = buildService();

      const existing = { id: 'uuid-1', read: false };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation((cm: ContactMessage) => Promise.resolve(cm));

      const result = await service.updateRead('uuid-1', readDto());

      expect(repo.save).toHaveBeenCalledWith({ id: 'uuid-1', read: true });
      expect(result.contactMessage.read).toBe(true);
    });

    it('lanza NotFoundException cuando el mensaje no existe', async () => {
      const { service, repo } = buildService();

      repo.findOne.mockResolvedValue(null);

      await expect(
        service.updateRead('id-inexistente', readDto()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('elimina el mensaje y confirma la eliminación', async () => {
      const { service, repo } = buildService();

      const existing = { id: 'uuid-1' };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(existing);

      const result = await service.remove('uuid-1');

      expect(repo.remove).toHaveBeenCalledWith(existing);
      expect(result).toEqual({
        message: expect.stringContaining('eliminado'),
      });
    });
  });
});