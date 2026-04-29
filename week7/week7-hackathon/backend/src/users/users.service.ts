import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createOrUpdate(userData: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }): Promise<UserDocument> {
    const existingUser = await this.findByGoogleId(userData.googleId);
    if (existingUser) {
      existingUser.email = userData.email;
      existingUser.firstName = userData.firstName || existingUser.firstName;
      existingUser.lastName = userData.lastName || existingUser.lastName;
      existingUser.picture = userData.picture || existingUser.picture;
      return existingUser.save();
    }
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}
