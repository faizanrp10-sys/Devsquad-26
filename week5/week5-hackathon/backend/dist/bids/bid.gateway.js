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
let BidGateway = class BidGateway {
    bidsService;
    server;
    constructor(bidsService) {
        this.bidsService = bidsService;
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
            const result = await this.bidsService.placeBid(data.carId, data.userId, data.amount);
            this.server.to(`auction_${data.carId}`).emit('new_bid', {
                amount: data.amount,
                bidder: result.bid.bidder,
                timestamp: new Date()
            });
            return { status: 'success' };
        }
        catch (error) {
            client.emit('bid_error', { message: error.message });
            return { status: 'error', message: error.message };
        }
    }
    broadcastAuctionStart(carId) {
        this.server.emit('bid_start', { carId });
    }
    broadcastAuctionEnd(carId, winner) {
        this.server.emit('bid_ended', { carId });
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
exports.BidGateway = BidGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [bids_service_1.BidsService])
], BidGateway);
//# sourceMappingURL=bid.gateway.js.map