import { Injectable } from '@nestjs/common';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

@Injectable()
export class EmbeddingService {
  private embeddings: HuggingFaceTransformersEmbeddings;

  constructor() {
    this.embeddings = new HuggingFaceTransformersEmbeddings({
    //   modelName: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
      modelName: 'Xenova/all-MiniLM-L6-v2'

    });
  }

  async embed(text: string): Promise<number[]> {
    const vectors = await this.embeddings.embedQuery(text);
    return vectors;
  }
}
