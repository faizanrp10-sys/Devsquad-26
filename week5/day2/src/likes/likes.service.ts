import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like } from './schemas/like.schema';
import { Comment } from '../comments/schemas/comment.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async likeComment(commentId: string, userId: string): Promise<{ like: Like; comment: Comment }> {
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid IDs');
    }

    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if already liked
    const existingLike = await this.likeModel.findOne({
      user: new Types.ObjectId(userId),
      comment: new Types.ObjectId(commentId),
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this comment');
    }

    // Create like
    const like = new this.likeModel({
      user: new Types.ObjectId(userId),
      comment: new Types.ObjectId(commentId),
    });

    await like.save();

    // Update comment's like count
    comment.likes.push(like._id);
    comment.likeCount += 1;
    await comment.save();

    return {
      like,
      comment: await comment.populate('author'),
    };
  }

  async unlikeComment(commentId: string, userId: string): Promise<{ comment: Comment }> {
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid IDs');
    }

    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Delete like
    const like = await this.likeModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      comment: new Types.ObjectId(commentId),
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    // Update comment's like count
    comment.likes = comment.likes.filter((likeId) => !likeId.equals(like._id));
    comment.likeCount = Math.max(0, comment.likeCount - 1);
    await comment.save();

    return {
      comment: await comment.populate('author'),
    };
  }

  async getCommentLikes(commentId: string): Promise<Like[]> {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException('Invalid comment ID');
    }

    return this.likeModel
      .find({ comment: new Types.ObjectId(commentId) })
      .populate('user');
  }

  async isCommentLikedByUser(commentId: string, userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(userId)) {
      return false;
    }

    const like = await this.likeModel.findOne({
      user: new Types.ObjectId(userId),
      comment: new Types.ObjectId(commentId),
    });

    return !!like;
  }
}
