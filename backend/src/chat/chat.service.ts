import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../database/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { DocumentRepositoryService } from 'src/database/filehandling/document/document.repository.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private ChatRepository: Repository<Chat>,
    private embeddingService: EmbeddingService,
    private documentRepositoryService: DocumentRepositoryService
  ) { }


  // Create a new chat entry
  async create(createChatDto: CreateChatDto) {
    this.ChatRepository.save(
      this.ChatRepository.create(createChatDto)
    );
  }

  chunk = {
    text : (text: string, maxLength = 1000, overlap = 200): string[] => {
      const words = text.split(' ');
      let chunks: string[] = [];
      let start = 0;

      while (start < words.length) {
        const chunk = words.slice(start, start + maxLength).join(' ');
        chunks.push(chunk);
        start += maxLength - overlap; // overlap to help preserve context
      }

      return chunks;
    },

    findRelevantChunks:(question: string, chunks: string[]): string[] => {
      return chunks.filter(chunk => {
        const qWords = question.toLowerCase().split(/\s+/);
        return qWords.some(word => chunk.toLowerCase().includes(word));
      });
    },

    cosineSimilarity: (a: number[], b: number[]): number => {
      const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
      const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
      if (normA === 0 || normB === 0) return 0;
      return dotProduct / (normA * normB);
    }
  }

  async getAImessage(taskId: string, question: string): Promise<any[]> {
    const relevantChunks = await this.embeddingService.findRelevantChunks(taskId, question);
    const previousChat = await this.ChatRepository.find({ select: ['question', 'answer', 'document_id'], where: { task_id: taskId } });
    const topChunks = relevantChunks.map(c => c.chunk).join('\n\n');

    console.log(topChunks );

    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant. You must ONLY answer using the provided document text.
          If the question is outside the document or previous questions, say: "I can only answer questions from the document".
          If the question does not make sense or is unclear, say: "I can't understand, please ask clearly."
          Answer carefully and do not make up anything.
          Always format your answers in clean Markdown only. Do not include raw HTML tags. 
          Use Markdown for headings, bold, italic, code, lists, and line breaks.`,
      },
      {
        role: 'user',
        // content: `Context:\n${topChunks}\n\n`, 
        content: `Document: ${topChunks}`
      },
    ];

    previousChat.forEach((chat) => {
      messages.push(
        {
          'role': 'user',
          'content': 'Question:' + chat.question,
        }, {
        'role': 'assistant',
        'content': 'Answer:' + chat.answer,
      }
      );
    });

    messages.push({
      'role': 'user',
      'content': 'Question:' + question,
    });

    return messages;
  }

  async ask(docId: number, question: string): Promise<string> {
    // // const message = await this.getAImessage(docId, question);
    

    // if(message.length === 0) {;
    //   return "Error: No document found, Please upload a document first.";
    // }

    // const response = await fetch('http://localhost:11434/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     stream: false,
    //     model: "llama3.2",
    //     // model: "tinyllama:1.1b",
    //     messages: message,
    //   }),
    // });

    // const data = await response.json();
    // const answer = data.message?.content ?? "No answer found.";

    // // Save the conversation
    // if(answer && answer !== "No answer found.") {
    //   await this.create({
    //     document_id: docId,
    //     question: question,
    //     answer: answer,
    //   })
    // };

    // return answer;
    return '';
  }
}
