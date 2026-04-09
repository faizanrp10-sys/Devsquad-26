import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum PaymentType {
  MONEY = 'money',
  POINTS = 'points',
  HYBRID = 'hybrid',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ enum: PaymentType, default: PaymentType.MONEY })
  paymentType: PaymentType;

  // The cost in loyalty points if bought entirely with points
  @Prop({ default: 0 })
  pointsPrice: number;

  @Prop({ default: false })
  isOnSale: boolean;

  @Prop({ default: 0 })
  discountPercentage: number;

  @Prop({ default: 0 })
  salePrice: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Calculate salePrice before saving
ProductSchema.pre('save', function () {
  if (this.isOnSale && this.discountPercentage > 0) {
    this.salePrice = this.price - (this.price * (this.discountPercentage / 100));
  } else {
    this.salePrice = this.price;
  }
});
