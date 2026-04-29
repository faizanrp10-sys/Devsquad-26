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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const raw_materials_service_1 = require("../raw-materials/raw-materials.service");
let ProductsService = class ProductsService {
    productModel;
    rawMaterialsService;
    constructor(productModel, rawMaterialsService) {
        this.productModel = productModel;
        this.rawMaterialsService = rawMaterialsService;
    }
    async create(dto) {
        return new this.productModel(dto).save();
    }
    async findAll() {
        const products = await this.productModel.find().exec();
        const enriched = await Promise.all(products.map(async (product) => {
            const available = await this.calculateAvailableQuantity(product);
            return {
                ...product.toObject(),
                availableQuantity: available,
            };
        }));
        return enriched;
    }
    async findByCategory(category) {
        const products = await this.productModel.find({ category }).exec();
        const enriched = await Promise.all(products.map(async (product) => {
            const available = await this.calculateAvailableQuantity(product);
            return {
                ...product.toObject(),
                availableQuantity: available,
            };
        }));
        return enriched;
    }
    async findById(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product)
            throw new common_1.NotFoundException(`Product ${id} not found`);
        const available = await this.calculateAvailableQuantity(product);
        return {
            ...product.toObject(),
            availableQuantity: available,
        };
    }
    async update(id, dto) {
        const product = await this.productModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!product)
            throw new common_1.NotFoundException(`Product ${id} not found`);
        return product;
    }
    async remove(id) {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException(`Product ${id} not found`);
    }
    async getCategories() {
        return this.productModel.distinct('category').exec();
    }
    async calculateAvailableQuantity(product) {
        if (!product.recipe || product.recipe.length === 0) {
            return 0;
        }
        let minAvailable = Infinity;
        for (const item of product.recipe) {
            try {
                const material = await this.rawMaterialsService.findById(item.materialId.toString());
                const possible = Math.floor(material.stock / item.quantity);
                minAvailable = Math.min(minAvailable, possible);
            }
            catch {
                return 0;
            }
        }
        return minAvailable === Infinity ? 0 : minAvailable;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        raw_materials_service_1.RawMaterialsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map