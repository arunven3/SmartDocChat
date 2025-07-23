
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Document } from '../database/filehandling/document/document.entity';
import { Chat } from '../database/chat.entity';
import { ChatGateway } from './chat.gateway'; 
import { Chunk } from 'src/database/filehandling/chunk/chunk.entity';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { DocumentRepositoryService } from 'src/database/filehandling/document/document.repository.service';
import { ChunkRepositoryService } from 'src/database/filehandling/chunk/chunk.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Chat, ChatGateway, Chunk])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, EmbeddingService, DocumentRepositoryService, ChunkRepositoryService],
})
export class ChatModule {}
