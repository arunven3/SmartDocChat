import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chunk } from './chunk.entity';
import { Repository } from 'typeorm';
import { CreateChunkDTO } from './chunk.dto';
// import { DocumentRepositoryService } from '../document/document.repository.service';

@Injectable()
class ChunkRepositoryService {
    constructor(
        @InjectRepository(Chunk)
        private readonly repo: Repository<Chunk>
    ){}

    async create(chunk: CreateChunkDTO): Promise<number> {
        return (await this.repo.save(this.repo.create(chunk))).id;
    }

    async get(taskId: string): Promise<Chunk[]> {
        return  await  this.repo.find({select:['chunk', 'embedding'], order:{id: 'ASC'} , where: {task_id: taskId}})
    }
}

export { ChunkRepositoryService, CreateChunkDTO, Chunk }
