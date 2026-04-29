import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawMaterialDocument = RawMaterial & Document;

@Schema({ timestamps: true })
export class RawMaterial {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  unit: string; // e.g., 'g', 'ml', 'pcs'

  @Prop({ required: true, default: 0, min: 0 })
  stock: number;

  @Prop({ required: true, default: 0, min: 0 })
  minLevel: number; // threshold for low-stock alerts
}

export const RawMaterialSchema = SchemaFactory.createForClass(RawMaterial);
