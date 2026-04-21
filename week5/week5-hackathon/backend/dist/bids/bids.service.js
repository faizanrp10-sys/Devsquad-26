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
exports.BidsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bid_schema_1 = require("./schemas/bid.schema");
const cars_service_1 = require("../cars/cars.service");
let BidsService = class BidsService {
    bidModel;
    carsService;
    constructor(bidModel, carsService) {
        this.bidModel = bidModel;
        this.carsService = carsService;
    }
    async placeBid(carId, userId, amount) {
        const car = await this.carsService.findById(carId);
        if (!car)
            throw new common_1.BadRequestException('Car not found');
        if (car.status !== 'active')
            throw new common_1.BadRequestException('Auction has ended');
        if (car.seller._id.toString() === userId) {
            throw new common_1.BadRequestException('You cannot bid on your own car');
        }
        if (amount <= car.price) {
            throw new common_1.BadRequestException('Bid must be higher than current price');
        }
        const newBid = new this.bidModel({ car: carId, bidder: userId, amount });
        await newBid.save();
        await this.carsService.updatePriceAndWinner(carId, amount, userId);
        const populatedBid = await newBid.populate('bidder', 'name');
        return { bid: populatedBid, car };
    }
    async getBidsForCar(carId) {
        return this.bidModel.find({ car: carId }).sort({ amount: -1 }).populate('bidder', 'name').exec();
    }
    async getBidsByUser(userId) {
        return this.bidModel.find({ bidder: userId }).populate('car').exec();
    }
    async getCarById(carId) {
        return this.carsService.findById(carId);
    }
    async payForCar(carId) {
        return this.carsService.payForCar(carId);
    }
    async updateShippingStatus(carId, status) {
        return this.carsService.updateShippingStatus(carId, status);
    }
};
exports.BidsService = BidsService;
exports.BidsService = BidsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bid_schema_1.Bid.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cars_service_1.CarsService])
], BidsService);
//# sourceMappingURL=bids.service.js.map