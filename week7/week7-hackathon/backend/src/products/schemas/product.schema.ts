import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export class RecipeItem {
  @Prop({ type: Types.ObjectId, ref: 'RawMaterial', required: true })
  materialId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  quantity: number; // amount of raw material needed per unit of product
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop()
  image: string;

  @Prop({ required: true, default: 'Hot Dishes' })
  category: string;

  @Prop({
    type: [
      {
        materialId: { type: Types.ObjectId, ref: 'RawMaterial' },
        quantity: { type: Number, required: true },
      },
    ],
    default: [],
  })
  recipe: RecipeItem[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
