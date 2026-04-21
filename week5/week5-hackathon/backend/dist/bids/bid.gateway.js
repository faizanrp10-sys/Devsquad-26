"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const bids_service_1 = require("./bids.service");
const notifications_service_1 = require("../notifications/notifications.service");
let BidGateway = class BidGateway {
    bidsService;
    notificationsService;
    server;
    constructor(bidsService, notificationsService) {
        this.bidsService = bidsService;
        this.notificationsService = notificationsService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinAuction(data, client) {
        client.join(`auction_${data.carId}`);
        console.log(`Client ${client.id} joined auction_${data.carId}`);
    }
    async handlePlaceBid(data, client) {
        try {
            const car = await this.bidsService.getCarById(data.carId);
            if (car.seller.toString() === data.userId) {
                throw new Error('You cannot bid on your own car.');
            }
            const previousBids = await this.bidsService.getBidsForCar(data.carId);
            const previousTopBidder = previousBids.length > 0 ? previousBids[0].bidder : null;
            const result = await this.bidsService.placeBid(data.carId, data.userId, data.amount);
            this.server.to(`auction_${data.carId}`).emit('new_bid', {
                amount: data.amount,
                bidder: result.bid.bidder,
                timestamp: new Date()
            });
            const bidMsg = `New bid of $${data.amount?.toLocaleString()} on ${car.make} ${car.model}`;
            this.server.emit('new_bid', {
                amount: data.amount,
                carId: data.carId,
                make: car.make,
                model: car.model,
                timestamp: new Date()
            });
            await this.notificationsService.create(car.seller.toString(), bidMsg, 'new_bid', data.carId);
            await this.notificationsService.create(data.userId, `You placed a bid of $${data.amount?.toLocaleString()} on ${car.make} ${car.model}`, 'new_bid', data.carId);
            if (previousTopBidder && previousTopBidder.toString() !== data.userId) {
                const outbidMsg = `You have been outbid on ${car.make} ${car.model}. New top bid is $${data.amount?.toLocaleString()}`;
                await this.notificationsService.create(previousTopBidder.toString(), outbidMsg, 'system', data.carId);
            }
            return { status: 'success' };
        }
        catch (error) {
            client.emit('bid_error', { message: error.message });
            return { status: 'error', message: error.message };
        }
    }
    async handleMakePayment(data, client) {
        try {
            const car = await this.bidsService.payForCar(data.carId);
            this.server.to(`auction_${data.carId}`).emit('shipping_update', {
                carId: data.carId,
                status: 'ready_for_shipping',
                lotNumber: car.lotNumber
            });
            const successMsg = `Success! Your bid of $${car.price?.toLocaleString()} for ${car.make} ${car.model} was placed`;
            this.server.emit('bid_success', {
                amount: car.price,
                carId: data.carId,
                make: car.make,
                model: car.model,
                timestamp: new Date()
            });
            if (car.winner) {
                await this.notificationsService.create(car.winner.toString(), successMsg, 'bid_success', data.carId);
            }
            this.advanceShipping(data.carId, 'in_transit', 60000);
            this.advanceShipping(data.carId, 'delivered', 120000);
            return { status: 'success' };
        }
        catch (error) {
            return { status: 'error', message: error.message };
        }
    }
    advanceShipping(carId, status, delay) {
        setTimeout(async () => {
            try {
                await this.bidsService.updateShippingStatus(carId, status);
                this.server.to(`auction_${carId}`).emit('shipping_update', {
                    carId,
                    status
                });
                console.log(`Shipping status for ${carId} updated to ${status}`);
            }
            catch (err) {
                console.error(`Failed to advance shipping for ${carId}:`, err.message);
            }
        }, delay);
    }
    broadcastAuctionStart(carId) {
        this.server.emit('bid_start', { carId });
    }
    async broadcastAuctionEnd(carId, winner) {
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
            await this.notificationsService.create(winner.toString(), winnerMsg, 'bid_success', carId);
        }
        this.server.emit('bid_winner', { carId, winner });
    }
};
exports.BidGateway = BidGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], BidGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_auction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], BidGateway.prototype, "handleJoinAuction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('place_bid'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], BidGateway.prototype, "handlePlaceBid", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('make_payment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], BidGateway.prototype, "handleMakePayment", null);
exports.BidGateway = BidGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
            credentials: true
        },
        transports: ['polling', 'websocket']
    }),
    __metadata("design:paramtypes", [bids_service_1.BidsService,
        notifications_service_1.NotificationsService])
], BidGateway);
//# sourceMappingURL=bid.gateway.js.map