import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
  COMMENT = 'comment',
  REPLY = 'reply',
  LIKE = 'like',
  FOLLOW = 'follow',
}

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actor: Types.ObjectId;

  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  comment: Types.ObjectId | null;

  @Prop({ default: false })
  read: boolean;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
