import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Car } from '../../cars/schemas/car.schema';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  bidder: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId | Car;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
