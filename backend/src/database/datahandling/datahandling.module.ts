import { Module } from '@nestjs/common';
import { ChatRepositoryService } from './chat/chat.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat/chat.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Chat])],
    providers: [ChatRepositoryService],
    exports:[ChatRepositoryService]
})
export class DatahandlingModule {}
