import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CommonModule } from '../common/common.module.js';
import { ContactMessagesPublicController } from './contact-messages.public.controller.js';
import { ContactMessagesController } from './contact-messages.controller.js';
import { ContactMessagesService } from './contact-messages.service.js';
import { ContactMessage } from './entities/contact-message.entity.js';

@Module({
  controllers: [ContactMessagesPublicController, ContactMessagesController],
  providers: [ContactMessagesService],
  imports: [
    TypeOrmModule.forFeature([ContactMessage]),
    AuthModule,
    CommonModule,
  ],
})
export class ContactMessagesModule {}