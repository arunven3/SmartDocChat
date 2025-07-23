import { Injectable, Module } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './document.entity'; 
import { CreateDocumentDto } from './document.dto';
import { Repository } from 'typeorm';


@Injectable()
class DocumentRepositoryService {
    constructor(
        @InjectRepository(Document)
        private readonly repo: Repository<Document>,
    ){}
    
    async create(document: CreateDocumentDto): Promise<number> {
        return (await this.repo.save(this.repo.create(document))).id
    }
}

export {DocumentRepositoryService, CreateDocumentDto, Document}
