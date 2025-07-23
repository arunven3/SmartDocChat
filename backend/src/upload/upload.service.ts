
import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { EmbeddingService } from 'src/embedding/embedding.service';
// import { DocumentRepositoryService, CreateDocumentDto } from 'src/database/document/document.repository.service';
import * as math from 'mathjs';
import axios from 'axios';
import { randomUUID } from 'crypto';


@Injectable()
export class UploadService {
  constructor(
    // private documentRepo : DocumentRepositoryService,
    private embeddingService: EmbeddingService
  ) { }


  chunk = {
    split(text: string, size = 500): string[] {
      const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
      const chunks: string[] = [];
      let current = '';

      for (const sentence of sentences) {
        if ((current + sentence).length > size) {
          chunks.push(current);
          current = sentence;
        } else {
          current += sentence;
        }
      }

      if (current) chunks.push(current);
      return chunks;
    },

    async embed(text: string): Promise<number[]> {
      const systemPrompt = `
        Embed the input text using your internal representation.
        Output ONLY a JSON array of floats. No extra words. Just JSON.

        Input: ${text}
        `;

      const response = await axios.post('http://localhost:11434/api/embeddings', {
        method: 'POST',
        body: JSON.stringify({
          model: 'snowflake-arctic-embed',
          stream: 'false',
          prompt: systemPrompt,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data.embedding;

      console.log(response.data);
      const raw = data.response.trim();

      const vector = JSON.parse(raw);
      return vector;
    }
  };

  async handleUpload(files: Express.Multer.File[]): Promise<{}> {
    const taskId = randomUUID();

    try {
      for (const file of files) {
          const data = await pdf(file.buffer);

          if (!data.text) {
            throw new Error('PDF content is empty or could not be parsed.');
          }

          
          const docId = await this.embeddingService.embedAndStore(data.text, taskId, file.originalname);
        }

        return {message: 'file saved.', taskId}

    } catch (error) {
      let message = 'An error occurred while processing the PDF file.';
      console.error('Error parsing PDF:', error);

      if (error.message.includes('No password given')) {
        console.error('Please upload the non-password protected file:');
        message = 'Please upload a non-password protected PDF file.';
      }

      return {message , taskId};
    }
  }
}
