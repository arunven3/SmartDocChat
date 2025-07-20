import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { ChatModule } from './chat/chat.module';
import { Document } from './entities/document.entity';
import { Chunk } from './entities/chunk.entity';
import { Chat } from './entities/chat.entity';
import { join } from 'path';
import { EmbeddingService } from './embedding/embedding.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database:  join(__dirname, '..', 'db.sqlite'),
      entities: [Document, Chat, Chunk],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Document, Chat, Chunk]),
    UploadModule,
    ChatModule
  ],
  providers: [EmbeddingService],
})
export class AppModule {}
