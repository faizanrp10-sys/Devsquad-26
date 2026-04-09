import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  emitSaleStarted(payload: { productId?: string; message: string }) {
    this.server.emit('saleStarted', payload);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any) {
    return { event: 'pong', data };
  }
}
