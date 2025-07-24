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
        model: 'llama3.2', // Takes 3.2 gb RAM, Gives result from doucmnt
        // model: 'tinyllama:1.1b', // takes 1 gb of RAM, Bad results
        // model: 'mistral:latest', // Takes 7.5gb of RAM, Gives better results
        messages: message,
        stream: true
      })
    });

    if (!response.body) {
      console.error('No stream body');
      return;
    }

    const decoder = new TextDecoder();
    let answer = '';

    for await (const chunk of response.body as any) {
      decoder.decode(chunk).split('\n').forEach(line => {
        if (line.trim()) {
          try {
            const token = JSON.parse(line).message?.content;

            if (token) {
              answer += token;
              this.server.emit('answer_chunk', token);
            }
          } catch (err) {
            console.log('Skip non-JSON line:', line);
          }
        }
      });
    }

    this.chatService.saveChat(payload.taskId, payload.question, answer);
    this.server.emit('answer_done');
  }
}