import { Injectable } from '@nestjs/common';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { ChatRepositoryService, CreateChatDTO } from 'src/database/datahandling/chat/chat.repository.service';

@Injectable()
export class ChatService {
  constructor(
    private embeddingService: EmbeddingService,
    private chatRepositoryService: ChatRepositoryService,
  ) { }

  async getAImessage(taskId: string, question: string): Promise<any[]> {
    const relevantChunks = await this.embeddingService.findRelevantChunks(taskId, question);
    const topChunks = relevantChunks.map(c => c.chunk).join('\n\n');

    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant named as "SmartDocChat" for answer the question, You must answer from the Given Context only,
          If the question does not make sense or is unclear, say: "I can't understand, please ask clearly."
          Always format your answers in clean Markdown only. Do not include raw HTML tags. 
          Use Markdown for headings, bold, italic, code, lists, and line breaks.`,
      },
      {
        role: 'user',
        content: `Context:\n${topChunks}\n\n`, 
      },
    ];

    const previousChat = await this.chatRepositoryService.getChatHistory(taskId);

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

  async saveChat(taskId: string, question: string, answer: string) {
    this.chatRepositoryService.create(new CreateChatDTO(question, answer, taskId));
  }
}
