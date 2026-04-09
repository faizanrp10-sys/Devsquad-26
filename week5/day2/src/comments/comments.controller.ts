import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { Comment } from './schemas/comment.schema';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Request() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get('/:id')
  async getCommentById(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findById(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: string, @Request() req: any): Promise<void> {
    return this.commentsService.delete(id, req.user.id);
  }

  @Get('/:commentId/replies')
  async getReplies(@Param('commentId') commentId: string): Promise<Comment[]> {
    return this.commentsService.getReplies(commentId);
  }
}
