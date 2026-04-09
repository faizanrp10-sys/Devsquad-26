import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentComment: Types.ObjectId | null;

  @Prop({ type: [Types.ObjectId], ref: 'Comment', default: [] })
  replies: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Like', default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
