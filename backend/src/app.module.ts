import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { ChatModule } from './chat/chat.module';
import { join } from 'path';
import { EmbeddingModule } from './embedding/embedding.module';
import { FilehandlingModule } from './database/filehandling/filehandling.module';
import { Document } from './database/filehandling/document/document.entity';
import { Chunk } from './database/filehandling/chunk/chunk.entity';
import { Chat } from './database/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database:  join(__dirname, '../database/', 'db.sqlite'),
      entities: [Document, Chunk, Chat],
      synchronize: true,
    }),
    TypeOrmModule.forFeature(),
    UploadModule,
    ChatModule,
    EmbeddingModule,
    FilehandlingModule
  ],
  providers: [],
})
export class AppModule {
  constructor(){
    join(__dirname, '../database/', 'db.sqlite')
  }
}
