import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from './likes.service';
import { Like } from './schemas/like.schema';

@Controller('api/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/:commentId')
  @UseGuards(JwtAuthGuard)
  async likeComment(@Param('commentId') commentId: string, @Request() req: any) {
    return this.likesService.likeComment(commentId, req.user.id);
  }

  @Delete('/:commentId')
  @UseGuards(JwtAuthGuard)
  async unlikeComment(@Param('commentId') commentId: string, @Request() req: any) {
    return this.likesService.unlikeComment(commentId, req.user.id);
  }

  @Get('/comment/:commentId')
  async getCommentLikes(@Param('commentId') commentId: string): Promise<Like[]> {
    return this.likesService.getCommentLikes(commentId);
  }

  @Get('/check/:commentId')
  @UseGuards(JwtAuthGuard)
  async isLiked(@Param('commentId') commentId: string, @Request() req: any): Promise<{ isLiked: boolean }> {
    const isLiked = await this.likesService.isCommentLikedByUser(commentId, req.user.id);
    return { isLiked };
  }
}
