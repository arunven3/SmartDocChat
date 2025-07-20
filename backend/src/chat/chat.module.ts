
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Document } from '../entities/document.entity';
import { Chat } from '../entities/chat.entity';
import { ChatGateway } from './chat.gateway'; 
import { Chunk } from 'src/entities/chunk.entity';
import { EmbeddingService } from 'src/embedding/embedding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Chat, ChatGateway, Chunk])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, EmbeddingService],
})
export class ChatModule {}
