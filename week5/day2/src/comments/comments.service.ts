import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const { content, parentCommentId } = createCommentDto;

    // If replying to a comment, check if parent exists
    let parentComment = null;
    if (parentCommentId) {
      if (!Types.ObjectId.isValid(parentCommentId)) {
        throw new NotFoundException('Invalid parent comment ID');
      }

      parentComment = await this.commentModel.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    // Create new comment
    const comment = new this.commentModel({
      author: new Types.ObjectId(authorId),
      content,
      parentComment: parentCommentId ? new Types.ObjectId(parentCommentId) : null,
    });

    const savedComment = await comment.save();

    // If this is a reply, add it to parent's replies
    if (parentComment) {
      parentComment.replies.push(savedComment._id);
      parentComment.replyCount += 1;
      await parentComment.save();
    }

    return savedComment.populate('author');
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel
      .find({ parentComment: null }) // Only top-level comments
      .populate('author')
      .populate({
        path: 'replies',
        populate: { path: 'author' },
      })
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid comment ID');
    }

    const comment = await this.commentModel
      .findById(id)
      .populate('author')
      .populate({
        path: 'replies',
        populate: { path: 'author' },
      });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
      comment.updatedAt = new Date();
    }

    return (await comment.save()).populate('author');
  }

  async delete(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // If this is a reply, remove it from parent's replies
    if (comment.parentComment) {
      await this.commentModel.findByIdAndUpdate(
        comment.parentComment,
        {
          $pull: { replies: comment._id },
          $inc: { replyCount: -1 },
        }
      );
    }

    // Delete the comment
    await this.commentModel.deleteOne({ _id: id });
  }

  async getReplies(commentId: string): Promise<Comment[]> {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException('Invalid comment ID');
    }

    return this.commentModel
      .find({ parentComment: new Types.ObjectId(commentId) })
      .populate('author')
      .sort({ createdAt: 1 });
  }
}
