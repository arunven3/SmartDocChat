import { Module } from '@nestjs/common';
import { ChunkRepositoryService } from './chunk/chunk.repository.service';
import { DocumentRepositoryService } from './document/document.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document/document.entity';
import { Chunk } from './chunk/chunk.repository.service';

@Module({
    imports: [TypeOrmModule.forFeature([Document, Chunk])],
    providers: [DocumentRepositoryService, ChunkRepositoryService],
    exports:[DocumentRepositoryService, ChunkRepositoryService]
})
export class FilehandlingModule {}
