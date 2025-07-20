
import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { Chunk } from 'src/entities/chunk.entity';
import { EmbeddingService } from 'src/embedding/embedding.service';
import * as math from 'mathjs';


@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Document)
    private docRepo: Repository<Document>,
    @InjectRepository(Chunk)
    private chunkRepo: Repository<Chunk>,
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

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          model: 'paraphrase-multilingual',
          prompt: systemPrompt,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      console.log(data);
      const raw = data.response.trim();

      const vector = JSON.parse(raw);
      return vector;
    }
  };

  async handleUpload(files: Express.Multer.File[]): Promise<number | string> {
    try {
      const fileName = `Uploaded-${Date.now()}`;

      let combinedText = '';

      for (const file of files) {
        const data = await pdf(file.buffer);
        combinedText += '\n' + data.text;
      }
      
      if (!combinedText) {
        throw new Error('PDF content is empty or could not be parsed.');
      }

      const doc = this.docRepo.create({
        filename: fileName,
        content: combinedText,
      });
      
      const savedDoc = await this.docRepo.save(doc);
      const chunks = this.chunk.split(combinedText);

      for (const chunkText of chunks) {
        const vector = await this.embeddingService.embed(chunkText)

        const chunk = this.chunkRepo.create({
          content: chunkText,
          embedding: vector,
          document_id: savedDoc.id,
          document: savedDoc,
        });
        await this.chunkRepo.save(chunk);
      }

      return savedDoc.id;
    } catch (error) {
      let message = 'An error occurred while processing the PDF file.';
      console.error('Error parsing PDF:', error);

      if (error.message.includes('No password given')) {
        console.error('Please upload the non-password protected file:');
        message = 'Please upload a non-password protected PDF file.';
      }

      return message;
    }
  }
}
