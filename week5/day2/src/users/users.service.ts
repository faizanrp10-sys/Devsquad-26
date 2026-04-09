import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID');
    }
    return this.userModel.findById(id).populate('followers following');
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).populate('followers following');
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateProfileDto },
      { new: true }
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.populate('followers following');
  }

  async follow(userId: string, targetUserId: string): Promise<{ follower: User; target: User }> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(targetUserId)) {
      throw new NotFoundException('Invalid user ID');
    }

    if (userId === targetUserId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const user = await this.userModel.findById(userId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!user || !targetUser) {
      throw new NotFoundException('User not found');
    }

    const userIdObj = new Types.ObjectId(userId);
    const targetUserIdObj = new Types.ObjectId(targetUserId);

    // Add targetUser to user's following list
    if (!user.following.includes(targetUserIdObj)) {
      user.following.push(targetUserIdObj);
      user.followingCount += 1;
      await user.save();
    }

    // Add user to targetUser's followers list
    if (!targetUser.followers.includes(userIdObj)) {
      targetUser.followers.push(userIdObj);
      targetUser.followerCount += 1;
      await targetUser.save();
    }

    return {
      follower: await user.populate('followers following'),
      target: await targetUser.populate('followers following'),
    };
  }

  async unfollow(userId: string, targetUserId: string): Promise<{ follower: User; target: User }> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(targetUserId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!user || !targetUser) {
      throw new NotFoundException('User not found');
    }

    const userIdObj = new Types.ObjectId(userId);
    const targetUserIdObj = new Types.ObjectId(targetUserId);

    // Remove targetUser from user's following list
    user.following = user.following.filter((id) => !id.equals(targetUserIdObj));
    user.followingCount = Math.max(0, user.followingCount - 1);
    await user.save();

    // Remove user from targetUser's followers list
    targetUser.followers = targetUser.followers.filter((id) => !id.equals(userIdObj));
    targetUser.followerCount = Math.max(0, targetUser.followerCount - 1);
    await targetUser.save();

    return {
      follower: await user.populate('followers following'),
      target: await targetUser.populate('followers following'),
    };
  }

  async getFollowers(userId: string): Promise<User[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId).populate('followers');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.followers as any[];
  }

  async getFollowing(userId: string): Promise<User[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId).populate('following');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.following as any[];
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().populate('followers following');
  }
}
