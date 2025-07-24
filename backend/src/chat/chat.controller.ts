
import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('ask')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  
}
