import { Server } from 'socket.io';
export declare class NotificationsGateway {
    server: Server;
    emitSaleStarted(payload: {
        productId?: string;
        message: string;
    }): void;
    handlePing(data: any): {
        event: string;
        data: any;
    };
}
