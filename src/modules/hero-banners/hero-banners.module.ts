import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroBannersController } from './hero-banners.controller.js';
import { HeroBannersService } from './hero-banners.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { HeroBanner } from './entities/hero-banner.entity.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  controllers: [HeroBannersController],
  providers: [HeroBannersService],
  imports: [
    TypeOrmModule.forFeature([HeroBanner]),
    AuthModule,
    CommonModule,
  ],
})
export class HeroBannersModule {}