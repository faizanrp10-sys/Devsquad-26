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
exports.RawMaterialsController = void 0;
const common_1 = require("@nestjs/common");
const raw_materials_service_1 = require("./raw-materials.service");
const create_raw_material_dto_1 = require("./dto/create-raw-material.dto");
const update_raw_material_dto_1 = require("./dto/update-raw-material.dto");
let RawMaterialsController = class RawMaterialsController {
    rawMaterialsService;
    constructor(rawMaterialsService) {
        this.rawMaterialsService = rawMaterialsService;
    }
    create(dto) {
        return this.rawMaterialsService.create(dto);
    }
    findAll() {
        return this.rawMaterialsService.findAll();
    }
    getLowStock() {
        return this.rawMaterialsService.getLowStock();
    }
    findOne(id) {
        return this.rawMaterialsService.findById(id);
    }
    update(id, dto) {
        return this.rawMaterialsService.update(id, dto);
    }
    remove(id) {
        return this.rawMaterialsService.remove(id);
    }
};
exports.RawMaterialsController = RawMaterialsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_raw_material_dto_1.CreateRawMaterialDto]),
    __metadata("design:returntype", void 0)
], RawMaterialsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RawMaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RawMaterialsController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RawMaterialsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_raw_material_dto_1.UpdateRawMaterialDto]),
    __metadata("design:returntype", void 0)
], RawMaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RawMaterialsController.prototype, "remove", null);
exports.RawMaterialsController = RawMaterialsController = __decorate([
    (0, common_1.Controller)('raw-materials'),
    __metadata("design:paramtypes", [raw_materials_service_1.RawMaterialsService])
], RawMaterialsController);
//# sourceMappingURL=raw-materials.controller.js.map