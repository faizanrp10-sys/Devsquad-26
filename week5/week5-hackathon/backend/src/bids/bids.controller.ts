import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get('car/:carId')
  getBidsForCar(@Param('carId') carId: string) {
    return this.bidsService.getBidsForCar(carId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/my-bids')
  getMyBids(@Request() req) {
    return this.bidsService.getBidsByUser(req.user.userId);
  }

  // Usually bids will come from socket.io, but we provide REST endpoint as well
  @UseGuards(JwtAuthGuard)
  @Post()
  placeBidREST(@Request() req, @Body() body: any) {
    return this.bidsService.placeBid(body.carId, req.user.userId, body.amount);
  }
}
