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
import { NotificationsService } from '../notifications/notifications.service';
import { UseGuards } from '@nestjs/common';
// Basic implementation, you'd want token validation on socket connections ideally
// For simplicity, we assume client passes { carId, userId, amount }

@WebSocketGateway({ 
  cors: { 
    origin: 'http://localhost:3000', 
    credentials: true 
  },
  transports: ['polling', 'websocket']
})
export class BidGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private bidsService: BidsService,
    private notificationsService: NotificationsService
  ) {}

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
      // Bidding Rules:
      // 1. A user cannot place a bid on their own uploaded cars.
      const car = await this.bidsService.getCarById(data.carId);
      if (car.seller.toString() === data.userId) {
        throw new Error('You cannot bid on your own car.');
      }

      // Identify the previous highest bidder to notify them of being outbid
      const previousBids = await this.bidsService.getBidsForCar(data.carId);
      const previousTopBidder = previousBids.length > 0 ? previousBids[0].bidder : null;

      const result = await this.bidsService.placeBid(data.carId, data.userId, data.amount);
      
      // Broadcast new bid to all clients in this auction room
      this.server.to(`auction_${data.carId}`).emit('new_bid', {
        amount: data.amount,
        bidder: result.bid.bidder,
        timestamp: new Date()
      });

      // Global emit for Navbar notifications
      const bidMsg = `New bid of $${data.amount?.toLocaleString()} on ${car.make} ${car.model}`;
      this.server.emit('new_bid', {
        amount: data.amount,
        carId: data.carId,
        make: car.make,
        model: car.model,
        timestamp: new Date()
      });

      // Persistent notification for seller
      await this.notificationsService.create(
        car.seller.toString(),
        bidMsg,
        'new_bid',
        data.carId
      );

      // Persistent notification for the bidder themselves
      await this.notificationsService.create(
        data.userId,
        `You placed a bid of $${data.amount?.toLocaleString()} on ${car.make} ${car.model}`,
        'new_bid',
        data.carId
      );

      // Persistent notification for being outbid
      if (previousTopBidder && previousTopBidder.toString() !== data.userId) {
        const outbidMsg = `You have been outbid on ${car.make} ${car.model}. New top bid is $${data.amount?.toLocaleString()}`;
        await this.notificationsService.create(
          previousTopBidder.toString(),
          outbidMsg,
          'system',
          data.carId
        );
      }

      return { status: 'success' };
    } catch (error) {
      client.emit('bid_error', { message: error.message });
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('make_payment')
  async handleMakePayment(
    @MessageBody() data: { carId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const car = await this.bidsService.payForCar(data.carId);
      
      this.server.to(`auction_${data.carId}`).emit('shipping_update', {
        carId: data.carId,
        status: 'ready_for_shipping',
        lotNumber: car.lotNumber
      });

      // Global emit for Navbar notifications
      const successMsg = `Success! Your bid of $${car.price?.toLocaleString()} for ${car.make} ${car.model} was placed`;
      this.server.emit('bid_success', {
        amount: car.price,
        carId: data.carId,
        make: car.make,
        model: car.model,
        timestamp: new Date()
      });

      // Save persistent notification for the buyer
      if (car.winner) {
        await this.notificationsService.create(
          car.winner.toString(),
          successMsg,
          'bid_success',
          data.carId
        );
      }

      // Start 60s progression logic
      this.advanceShipping(data.carId, 'in_transit', 60000);
      this.advanceShipping(data.carId, 'delivered', 120000);

      return { status: 'success' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  private advanceShipping(carId: string, status: string, delay: number) {
    setTimeout(async () => {
      try {
        await this.bidsService.updateShippingStatus(carId, status);
        this.server.to(`auction_${carId}`).emit('shipping_update', {
          carId,
          status
        });
        console.log(`Shipping status for ${carId} updated to ${status}`);
      } catch (err) {
        console.error(`Failed to advance shipping for ${carId}:`, err.message);
      }
    }, delay);
  }

  // Admin/System might emit these
  broadcastAuctionStart(carId: string) {
    this.server.emit('bid_start', { carId });
  }

  async broadcastAuctionEnd(carId: string, winner: any) {
    const car = await this.bidsService.getCarById(carId);
    const endMsg = `Auction ended for ${car?.make || 'car'} ${car?.model || ''}`;
    
    this.server.to(`auction_${carId}`).emit('bid_ended', { carId });
    this.server.emit('bid_ended', { 
      carId, 
      make: car?.make || 'Car', 
      model: car?.model || '' 
    });

    if (winner) {
        const winnerMsg = `Congratulations! You won the auction for ${car?.make} ${car?.model}!`;
        await this.notificationsService.create(
            winner.toString(),
            winnerMsg,
            'bid_success',
            carId
        );
    }

    this.server.emit('bid_winner', { carId, winner });
  }
}
