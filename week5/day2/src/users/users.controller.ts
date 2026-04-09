import { Controller, Get, Patch, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { User } from './schemas/user.schema';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get('/username/:username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Patch('/profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Post('/follow/:targetUserId')
  @UseGuards(JwtAuthGuard)
  async follow(@Request() req: any, @Param('targetUserId') targetUserId: string) {
    return this.usersService.follow(req.user.id, targetUserId);
  }

  @Post('/unfollow/:targetUserId')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Request() req: any, @Param('targetUserId') targetUserId: string) {
    return this.usersService.unfollow(req.user.id, targetUserId);
  }

  @Get('/followers/:userId')
  async getFollowers(@Param('userId') userId: string): Promise<User[]> {
    return this.usersService.getFollowers(userId);
  }

  @Get('/following/:userId')
  async getFollowing(@Param('userId') userId: string): Promise<User[]> {
    return this.usersService.getFollowing(userId);
  }
}
