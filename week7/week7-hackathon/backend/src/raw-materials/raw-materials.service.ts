import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawMaterial, RawMaterialDocument } from './schemas/raw-material.schema';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectModel(RawMaterial.name)
    private rawMaterialModel: Model<RawMaterialDocument>,
  ) {}

  async create(dto: CreateRawMaterialDto): Promise<RawMaterialDocument> {
    return new this.rawMaterialModel(dto).save();
  }

  async findAll(): Promise<RawMaterialDocument[]> {
    return this.rawMaterialModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<RawMaterialDocument> {
    const material = await this.rawMaterialModel.findById(id).exec();
    if (!material) throw new NotFoundException(`Raw material ${id} not found`);
    return material;
  }

  async update(id: string, dto: UpdateRawMaterialDto): Promise<RawMaterialDocument> {
    const material = await this.rawMaterialModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!material) throw new NotFoundException(`Raw material ${id} not found`);
    return material;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rawMaterialModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Raw material ${id} not found`);
  }

  async getLowStock(): Promise<RawMaterialDocument[]> {
    return this.rawMaterialModel
      .find({ $expr: { $lte: ['$stock', '$minLevel'] } })
      .exec();
  }

  async deductStock(id: string, amount: number): Promise<RawMaterialDocument> {
    const material = await this.rawMaterialModel.findById(id).exec();
    if (!material) throw new NotFoundException(`Raw material ${id} not found`);
    material.stock = Math.max(0, material.stock - amount);
    return material.save();
  }
}
