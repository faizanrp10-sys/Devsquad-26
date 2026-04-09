import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password?: string; // Hashed password

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }] })
  wishlist: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure returned objects don't include the password by default
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
