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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../schemas/order.schema");
const user_schema_1 = require("../schemas/user.schema");
const product_schema_1 = require("../schemas/product.schema");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let OrdersService = class OrdersService {
    orderModel;
    userModel;
    productModel;
    notificationsGateway;
    constructor(orderModel, userModel, productModel, notificationsGateway) {
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.productModel = productModel;
        this.notificationsGateway = notificationsGateway;
    }
    async createOrder(userId, createOrderDto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { items, paymentMethod } = createOrderDto;
        let totalAmount = 0;
        let totalPointsUsed = 0;
        const orderProducts = [];
        for (const item of items) {
            const product = await this.productModel.findById(item.productId);
            if (!product)
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
            if (product.stock < item.quantity)
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}`);
            const effectivePrice = product.isOnSale ? product.salePrice : product.price;
            if (paymentMethod === 'points' || paymentMethod === 'hybrid') {
                if (product.paymentType === 'money') {
                    throw new common_1.BadRequestException(`Product ${product.name} cannot be purchased with points`);
                }
                const pointsCost = product.pointsPrice * item.quantity;
                if (user.loyaltyPoints < pointsCost)
                    throw new common_1.BadRequestException('Insufficient loyalty points');
                totalPointsUsed += pointsCost;
                user.loyaltyPoints -= pointsCost;
            }
            else {
                totalAmount += effectivePrice * item.quantity;
            }
            product.stock -= item.quantity;
            await product.save();
            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                priceAtPurchase: effectivePrice,
                pointsAtPurchase: product.pointsPrice,
            });
        }
        const pointsEarned = Math.floor(totalAmount / 10);
        user.loyaltyPoints += pointsEarned;
        await user.save();
        const order = new this.orderModel({
            user: userId,
            products: orderProducts,
            totalAmount,
            paymentMethod,
            pointsEarned,
            pointsUsed: totalPointsUsed,
        });
        await order.save();
        return order;
    }
    async getUserOrders(userId) {
        return this.orderModel.find({ user: userId }).populate('products.productId').sort({ createdAt: -1 });
    }
    async getAllOrders() {
        return this.orderModel.find().populate('user', 'name email').populate('products.productId').sort({ createdAt: -1 });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map