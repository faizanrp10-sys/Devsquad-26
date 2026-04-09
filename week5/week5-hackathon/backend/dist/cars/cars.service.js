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
exports.CarsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const car_schema_1 = require("./schemas/car.schema");
let CarsService = class CarsService {
    carModel;
    constructor(carModel) {
        this.carModel = carModel;
    }
    async create(createData, userId) {
        const newCar = new this.carModel({ ...createData, seller: userId });
        return newCar.save();
    }
    async findAll(query) {
        const filter = {};
        if (query.make)
            filter.make = new RegExp(query.make, 'i');
        if (query.model)
            filter.model = new RegExp(query.model, 'i');
        if (query.year)
            filter.year = Number(query.year);
        if (query.bodyType)
            filter.bodyType = query.bodyType;
        if (query.status)
            filter.status = query.status;
        return this.carModel.find(filter).populate('seller', 'name').exec();
    }
    async findById(id) {
        const car = await this.carModel.findById(id).populate('seller', 'name').exec();
        if (!car)
            throw new common_1.NotFoundException('Car not found');
        return car;
    }
    async updatePriceAndWinner(id, newPrice, winnerId) {
        const updatePayload = { price: newPrice };
        if (winnerId) {
            updatePayload.winner = winnerId;
        }
        return this.carModel.findByIdAndUpdate(id, updatePayload, { new: true });
    }
    async updateStatus(id, status) {
        return this.carModel.findByIdAndUpdate(id, { status }, { new: true });
    }
    async findBySeller(userId) {
        return this.carModel.find({ seller: userId }).exec();
    }
};
exports.CarsService = CarsService;
exports.CarsService = CarsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(car_schema_1.Car.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CarsService);
//# sourceMappingURL=cars.service.js.map