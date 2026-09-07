import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { envConfiguration } from './config/env.config.js';
import * as pg from 'pg';

// Modules
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './modules/common/common.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/user.module.js';
import { TournamentsModule } from './modules/tournaments/tournaments.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { CoachesModule } from './modules/coaches/coaches.module.js';
import { TeamsModule } from './modules/teams/teams.module.js';
import { FieldsModule } from './modules/fields/fields.module.js';
import { PlayersModule } from './modules/players/players.module.js';
import { AnnouncementsModule } from './modules/announcements/announcements.module.js';
import { SponsorsModule } from './modules/sponsors/sponsors.module.js';
import { HeroBannersModule } from './modules/hero-banners/hero-banners.module.js';
import { VideosModule } from './modules/videos/videos.module.js';
import { GalleriesModule } from './modules/galleries/galleries.module.js';
import { GalleryImagesModule } from './modules/gallery-images/gallery-images.module.js';
import { ContactMessagesModule } from './modules/contact-messages/contact-messages.module.js';
import { CustomPagesModule } from './modules/custom-pages/custom-pages.module.js';
import { CustomPageImagesModule } from './modules/custom-page-images/custom-page-images.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ envConfiguration ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      driver: pg,
      url: process.env.DATABASE_URL ?? undefined,
      autoLoadEntities: true,
      synchronize: false,
      logging: false, // for debugging sql sentences
      ssl: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public'),
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    TournamentsModule,
    CategoriesModule,
    PlayersModule,
    CoachesModule,
    FieldsModule,
    SponsorsModule,
    HeroBannersModule,
    AnnouncementsModule,
    VideosModule,
    GalleriesModule,
    GalleryImagesModule,
    ContactMessagesModule,
    CustomPagesModule,
    CustomPageImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
