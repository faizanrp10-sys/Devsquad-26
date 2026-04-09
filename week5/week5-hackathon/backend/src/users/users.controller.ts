import { Controller, Get, Post, Param, Body, UseGuards, Request, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wishlist/:carId')
  addToWishlist(@Request() req, @Param('carId') carId: string) {
    return this.usersService.addToWishlist(req.user.userId, carId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('wishlist/:carId')
  removeFromWishlist(@Request() req, @Param('carId') carId: string) {
    return this.usersService.removeFromWishlist(req.user.userId, carId);
  }
}
