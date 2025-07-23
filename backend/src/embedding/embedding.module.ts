import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { FilehandlingModule } from '../database/filehandling/filehandling.module';;

@Module({
    imports: [FilehandlingModule],
    providers: [EmbeddingService],
})
export class EmbeddingModule {

}
