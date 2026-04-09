import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BidsService } from './bids.service';
import { UseGuards } from '@nestjs/common';
// Basic implementation, you'd want token validation on socket connections ideally
// For simplicity, we assume client passes { carId, userId, amount }

@WebSocketGateway({ cors: { origin: '*' } })
export class BidGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private bidsService: BidsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_auction')
  handleJoinAuction(@MessageBody() data: { carId: string }, @ConnectedSocket() client: Socket) {
    client.join(`auction_${data.carId}`);
    console.log(`Client ${client.id} joined auction_${data.carId}`);
  }

  @SubscribeMessage('place_bid')
  async handlePlaceBid(
    @MessageBody() data: { carId: string; userId: string; amount: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.bidsService.placeBid(data.carId, data.userId, data.amount);
      
      // Broadcast new bid to all clients in this auction room
      this.server.to(`auction_${data.carId}`).emit('new_bid', {
        amount: data.amount,
        bidder: result.bid.bidder,
        timestamp: new Date()
      });

      return { status: 'success' };
    } catch (error) {
      client.emit('bid_error', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }

  // Admin/System might emit these
  broadcastAuctionStart(carId: string) {
    this.server.emit('bid_start', { carId });
  }

  broadcastAuctionEnd(carId: string, winner: any) {
    this.server.emit('bid_ended', { carId });
    this.server.emit('bid_winner', { carId, winner });
  }
}
