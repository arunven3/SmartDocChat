import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import fetch from 'node-fetch';

@WebSocketGateway({cors: { origin: '*'}})

export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('askQuestion')
  async handleAsk(@MessageBody() payload: { taskId: string; question: string }) {
    console.log('Received question:', payload);
    const message = await this.chatService.getAImessage(payload.taskId, payload.question);

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: message,
        stream: true
      })
    });

    if (!response.body) {
      console.error('No stream body');
      return;
    }
    const decoder = new TextDecoder();

    for await (const chunk of response.body as any) {
      const text = decoder.decode(chunk);
      text.split('\n').forEach(line => {
        if (line.trim()) {
          try {
            const json = JSON.parse(line);
            const token = json.message?.content;
            if (token) {
              console.log('Emitting answer chunk:', token);
              this.server.emit('answer_chunk', token);
            }
          } catch (err) {
            console.log('Skip non-JSON line:', line);
          }
        }
      });
    }

    this.server.emit('answer_done');
  }
}