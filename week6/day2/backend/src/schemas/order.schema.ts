import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ _id: false })
class OrderProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  priceAtPurchase: number;

  @Prop({ required: true, default: 0 })
  pointsAtPurchase: number;
}
const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderProductSchema], required: true })
  products: OrderProduct[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  paymentMethod: string; // money, points, hybrid

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ default: 0 })
  pointsEarned: number;

  @Prop({ default: 0 })
  pointsUsed: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
