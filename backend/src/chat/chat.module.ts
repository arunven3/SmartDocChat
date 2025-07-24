
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway'; 
import { EmbeddingService } from 'src/embedding/embedding.service';
import { Chat } from 'src/database/datahandling/chat/chat.entity';
import { DatahandlingModule } from 'src/database/datahandling/datahandling.module'; 
import { EmbeddingModule } from 'src/embedding/embedding.module';


@Module({
  imports: [TypeOrmModule.forFeature([Chat]), DatahandlingModule, EmbeddingModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
