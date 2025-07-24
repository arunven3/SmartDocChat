import { Injectable, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@huggingface/transformers';
import { DocumentRepositoryService, CreateDocumentDto} from '../database/filehandling/document/document.repository.service';
import { ChunkRepositoryService, CreateChunkDTO, Chunk } from '../database/filehandling/chunk/chunk.repository.service';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private extractor: any;

  constructor(
    private readonly documentRepo: DocumentRepositoryService,
    private readonly chunkRepo: ChunkRepositoryService
  ) {}

  async onModuleInit() {
    this.extractor = await pipeline('feature-extraction', 'Snowflake/snowflake-arctic-embed-m-v2.0', { dtype: "q8" })
  }

  chunkText(text: string, chunkSize = 200): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  }

  async embedAndStore(text: string, taskId: string, fileName:string): Promise<number> {
    const docId = await this.documentRepo.create(new CreateDocumentDto(taskId, fileName));
    const chunks = this.chunkText(text);

    for (const c of chunks) {
      const output = await this.extractor([c], {
        normalize: true,
        pooling: 'cls',
      });
      const vector = output.tolist()[0];

      this.chunkRepo.create(new CreateChunkDTO(c, vector, docId, taskId));
    }

    return docId;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    
    if (normA === 0 || normB === 0) return 0;
    
    return a.reduce((sum, ai, i) => sum + ai * b[i], 0) / (normA * normB);
  }

  async findRelevantChunks(taskId: string, question: string, topK = 50): Promise<Chunk[]> {
    const output = await this.extractor([question], {
      normalize: true,
      pooling: 'cls',
    });

    const questionVec = output.tolist()[0];
    const allChunks = await this.chunkRepo.get(taskId);

    const scored = allChunks.map(chunk => ({
      chunk,
      score: this.cosineSimilarity(questionVec, chunk.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map(item => item.chunk);
  }
}
