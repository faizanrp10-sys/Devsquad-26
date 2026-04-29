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
const order_schema_1 = require("./schemas/order.schema");
const products_service_1 = require("../products/products.service");
const raw_materials_service_1 = require("../raw-materials/raw-materials.service");
let OrdersService = class OrdersService {
    orderModel;
    productsService;
    rawMaterialsService;
    constructor(orderModel, productsService, rawMaterialsService) {
        this.orderModel = orderModel;
        this.productsService = productsService;
        this.rawMaterialsService = rawMaterialsService;
    }
    async create(dto) {
        for (const item of dto.items) {
            const product = await this.productsService.findById(item.productId);
            if (product.availableQuantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for "${item.productName}". Available: ${product.availableQuantity}, Requested: ${item.quantity}`);
            }
        }
        for (const item of dto.items) {
            const product = await this.productsService.findById(item.productId);
            if (product.recipe && product.recipe.length > 0) {
                for (const recipeItem of product.recipe) {
                    const deductAmount = recipeItem.quantity * item.quantity;
                    await this.rawMaterialsService.deductStock(recipeItem.materialId.toString(), deductAmount);
                }
            }
        }
        const items = dto.items.map((item) => ({
            ...item,
            total: item.price * item.quantity,
        }));
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const discount = dto.discount || 0;
        const total = subtotal - discount;
        const orderCount = await this.orderModel.countDocuments().exec();
        const orderNumber = `#${(34562 + orderCount + 1).toString()}`;
        const order = new this.orderModel({
            orderNumber,
            items,
            subtotal,
            discount,
            total,
            orderType: dto.orderType,
            status: 'Preparing',
            paymentMethod: dto.paymentMethod,
            tableNo: dto.tableNo,
            customerName: dto.customerName,
        });
        return order.save();
    }
    async findAll(status) {
        const query = status ? { status } : {};
        return this.orderModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async findById(id) {
        const order = await this.orderModel.findById(id).exec();
        if (!order)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.orderModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        if (!order)
            throw new common_1.NotFoundException(`Order ${id} not found`);
        return order;
    }
    async getRecentOrders(limit = 10) {
        return this.orderModel.find().sort({ createdAt: -1 }).limit(limit).exec();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService,
        raw_materials_service_1.RawMaterialsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map