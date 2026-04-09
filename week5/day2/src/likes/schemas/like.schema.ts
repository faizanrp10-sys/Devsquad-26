import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', required: true })
  comment: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Create a unique index to prevent duplicate likes
LikeSchema.index({ user: 1, comment: 1 }, { unique: true });
