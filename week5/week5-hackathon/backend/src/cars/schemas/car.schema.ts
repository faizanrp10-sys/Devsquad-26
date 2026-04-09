import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  price: number; // Starting price or current highest bid

  @Prop({ required: true })
  auctionEndTime: Date;

  @Prop({ required: true, enum: ['active', 'sold', 'ended'], default: 'active' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId | User;

  @Prop({ required: true })
  bodyType: string; // e.g. sedan, sports, hatchback, etc.

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: '' })
  description: string;
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  winner?: Types.ObjectId | User;
}

export const CarSchema = SchemaFactory.createForClass(Car);
