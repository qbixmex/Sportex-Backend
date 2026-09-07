import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';
import { CustomPagesController } from './custom-pages.controller.js';
import { CustomPagesPublicController } from './custom-pages.public.controller.js';
import { CustomPagesService } from './custom-pages.service.js';
import { CustomPage } from './entities/custom-page.entity.js';

@Module({
  controllers: [CustomPagesController, CustomPagesPublicController],
  providers: [CustomPagesService],
  imports: [TypeOrmModule.forFeature([CustomPage]), AuthModule, CommonModule],
})
export class CustomPagesModule {}