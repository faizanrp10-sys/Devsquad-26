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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarSchema = exports.Car = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Car = class Car {
    make;
    model;
    year;
    price;
    auctionEndTime;
    status;
    shippingStatus;
    lotNumber;
    winningDate;
    endDate;
    seller;
    bodyType;
    mileage;
    images;
    description;
    winner;
};
exports.Car = Car;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Car.prototype, "make", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: 'other' }),
    __metadata("design:type", String)
], Car.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Car.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Car.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Car.prototype, "auctionEndTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['active', 'sold', 'ended', 'completed'], default: 'active' }),
    __metadata("design:type", String)
], Car.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['not_paid', 'ready_for_shipping', 'in_transit', 'delivered'], default: 'not_paid' }),
    __metadata("design:type", String)
], Car.prototype, "shippingStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Car.prototype, "lotNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Car.prototype, "winningDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Car.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], Car.prototype, "seller", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Car.prototype, "bodyType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Car.prototype, "mileage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Car.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Car.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], Car.prototype, "winner", void 0);
exports.Car = Car = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Car);
exports.CarSchema = mongoose_1.SchemaFactory.createForClass(Car);
//# sourceMappingURL=car.schema.js.map