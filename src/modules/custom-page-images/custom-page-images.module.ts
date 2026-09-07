import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';
import { CustomPage } from '../custom-pages/entities/custom-page.entity.js';
import { CustomPageImagesController } from './custom-page-images.controller.js';
import { CustomPageImagesService } from './custom-page-images.service.js';
import { CustomPageImage } from './entities/custom-page-image.entity.js';

@Module({
  controllers: [CustomPageImagesController],
  providers: [CustomPageImagesService],
  imports: [
    TypeOrmModule.forFeature([CustomPageImage, CustomPage]),
    AuthModule,
    CommonModule,
  ],
})
export class CustomPageImagesModule {}