import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: any) {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(query: any = {}) {
    const filter: any = {};
    if (query.category) filter.category = query.category;
    if (query.paymentType) filter.paymentType = query.paymentType;
    return this.productModel.find(filter).exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateDto: any) {
    const product = await this.productModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }

  async toggleSale(id: string, discountPercentage: number) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    product.isOnSale = !product.isOnSale;
    product.discountPercentage = discountPercentage;
    if (product.isOnSale) {
      product.salePrice = product.price - (product.price * discountPercentage / 100);
    } else {
      product.salePrice = product.price;
    }
    return product.save();
  }
}
