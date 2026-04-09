import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createData: any): Promise<UserDocument> {
    const newUser = new this.userModel(createData);
    return newUser.save();
  }

  async findByEmailForAuth(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).populate('wishlist').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addToWishlist(userId: string, carId: string) {
    return this.userModel.findByIdAndUpdate(userId, { $addToSet: { wishlist: carId } }, { new: true });
  }

  async removeFromWishlist(userId: string, carId: string) {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { wishlist: carId } }, { new: true });
  }
}
