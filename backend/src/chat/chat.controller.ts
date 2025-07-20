
import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('ask')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
 
  @Post()
  async ask(@Body() body: { documentId: number; question: string }) {
    const answer = await this.chatService.ask(body.documentId, body.question);
    return { answer };
  }
}
