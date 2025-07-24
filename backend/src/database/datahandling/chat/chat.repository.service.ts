import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDTO } from './chat.dto';

@Injectable()
class ChatRepositoryService {
    constructor (
        @InjectRepository(Chat)
        private readonly repo: Repository<Chat>
    ) {}

    async create(chat: CreateChatDTO): Promise<number> {
        return (await this.repo.save((this.repo.create(chat)))).id;
    }

    async getChatHistory(taskId: string): Promise<Chat[]> {
        return await this.repo.find({where: {task_id: taskId}})
    }
}

export {ChatRepositoryService, CreateChatDTO, Chat}