// import { Module } from '@nestjs/common';
// import { UploadController } from './upload.controller';
// import { UploadService } from './upload.service';

// @Module({
//   controllers: [UploadController],
//   providers: [UploadService]
// })
// export class UploadModule {}


// src/upload/upload.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Document } from '../database/filehandling/document/document.entity';
import { Chunk } from 'src/database/filehandling/chunk/chunk.entity';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { DocumentRepositoryService } from 'src/database/filehandling/document/document.repository.service';
import { ChunkRepositoryService } from 'src/database/filehandling/chunk/chunk.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Chunk])],
  controllers: [UploadController],
  providers: [UploadService, EmbeddingService, DocumentRepositoryService, ChunkRepositoryService],
})
export class UploadModule {}

