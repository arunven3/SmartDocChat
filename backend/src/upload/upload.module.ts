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
import { Document } from '../entities/document.entity';
import { Chunk } from 'src/entities/chunk.entity';
import { EmbeddingService } from 'src/embedding/embedding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Chunk])],
  controllers: [UploadController],
  providers: [UploadService, EmbeddingService],
})
export class UploadModule {}

