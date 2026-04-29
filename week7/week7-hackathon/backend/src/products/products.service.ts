import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly rawMaterialsService: RawMaterialsService,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    return new this.productModel(dto).save();
  }

  async findAll(): Promise<any[]> {
    const products = await this.productModel.find().exec();
    const enriched = await Promise.all(
      products.map(async (product) => {
        const available = await this.calculateAvailableQuantity(product);
        return {
          ...product.toObject(),
          availableQuantity: available,
        };
      }),
    );
    return enriched;
  }

  async findByCategory(category: string): Promise<any[]> {
    const products = await this.productModel.find({ category }).exec();
    const enriched = await Promise.all(
      products.map(async (product) => {
        const available = await this.calculateAvailableQuantity(product);
        return {
          ...product.toObject(),
          availableQuantity: available,
        };
      }),
    );
    return enriched;
  }

  async findById(id: string): Promise<any> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    const available = await this.calculateAvailableQuantity(product);
    return {
      ...product.toObject(),
      availableQuantity: available,
    };
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Product ${id} not found`);
  }

  async getCategories(): Promise<string[]> {
    return this.productModel.distinct('category').exec();
  }

  /**
   * Calculate how many units of a product can be made
   * based on current raw material stock.
   * availableQuantity = min(material.stock / recipe.quantity) for all recipe items
   */
  private async calculateAvailableQuantity(
    product: ProductDocument,
  ): Promise<number> {
    if (!product.recipe || product.recipe.length === 0) {
      return 0;
    }

    let minAvailable = Infinity;

    for (const item of product.recipe) {
      try {
        const material = await this.rawMaterialsService.findById(
          item.materialId.toString(),
        );
        const possible = Math.floor(material.stock / item.quantity);
        minAvailable = Math.min(minAvailable, possible);
      } catch {
        // Material not found means 0 available
        return 0;
      }
    }

    return minAvailable === Infinity ? 0 : minAvailable;
  }
}
