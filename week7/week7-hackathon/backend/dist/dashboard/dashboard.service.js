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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../orders/schemas/order.schema");
const raw_materials_service_1 = require("../raw-materials/raw-materials.service");
let DashboardService = class DashboardService {
    orderModel;
    rawMaterialsService;
    constructor(orderModel, rawMaterialsService) {
        this.orderModel = orderModel;
        this.rawMaterialsService = rawMaterialsService;
    }
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const revenueResult = await this.orderModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        const dishesResult = await this.orderModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $unwind: '$items' },
            { $group: { _id: null, total: { $sum: '$items.quantity' } } },
        ]);
        const totalDishesOrdered = dishesResult.length > 0 ? dishesResult[0].total : 0;
        const totalOrders = await this.orderModel
            .countDocuments({ status: { $ne: 'Cancelled' } })
            .exec();
        const mostOrdered = await this.orderModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productName',
                    totalOrdered: { $sum: '$items.quantity' },
                    image: { $first: '$items.productImage' },
                },
            },
            { $sort: { totalOrdered: -1 } },
            { $limit: 5 },
            {
                $project: {
                    name: '$_id',
                    totalOrdered: 1,
                    image: 1,
                    _id: 0,
                },
            },
        ]);
        const orderTypeBreakdown = await this.orderModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: '$orderType',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    type: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        const recentOrders = await this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(20)
            .exec();
        const lowStockMaterials = await this.rawMaterialsService.getLowStock();
        return {
            totalRevenue,
            totalDishesOrdered,
            totalCustomers: totalOrders,
            mostOrdered,
            orderTypeBreakdown,
            recentOrders,
            lowStockMaterials,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        raw_materials_service_1.RawMaterialsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map