import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BidsService } from './bids.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class BidGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private bidsService;
    private notificationsService;
    server: Server;
    constructor(bidsService: BidsService, notificationsService: NotificationsService);
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
    handleMakePayment(data: {
        carId: string;
    }, client: Socket): Promise<{
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
    }>;
    private advanceShipping;
    broadcastAuctionStart(carId: string): void;
    broadcastAuctionEnd(carId: string, winner: any): Promise<void>;
}
