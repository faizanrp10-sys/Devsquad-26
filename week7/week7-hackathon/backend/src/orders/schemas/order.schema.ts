import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop()
  productImage: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ default: '' })
  note: string;

  @Prop({ required: true, min: 0 })
  total: number; // price * quantity
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        productName: String,
        productImage: String,
        price: Number,
        quantity: Number,
        note: String,
        total: Number,
      },
    ],
    required: true,
  })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ required: true, enum: ['Dine In', 'To Go', 'Delivery'], default: 'Dine In' })
  orderType: string;

  @Prop({ required: true, enum: ['Pending', 'Preparing', 'Completed', 'Cancelled'], default: 'Pending' })
  status: string;

  @Prop({ required: true, enum: ['Credit Card', 'Paypal', 'Cash'], default: 'Cash' })
  paymentMethod: string;

  @Prop()
  tableNo: string;

  @Prop()
  customerName: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
