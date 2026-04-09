import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BidsService } from './bids.service';
export declare class BidGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private bidsService;
    server: Server;
    constructor(bidsService: BidsService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinAuction(data: {
        carId: string;
    }, client: Socket): void;
    handlePlaceBid(data: {
        carId: string;
        userId: string;
        amount: number;
    }, client: Socket): Promise<{
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
    }>;
    broadcastAuctionStart(carId: string): void;
    broadcastAuctionEnd(carId: string, winner: any): void;
}
