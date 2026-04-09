import { Controller, Get, Post, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @Get(':id')
  getCarById(@Param('id') id: string) {
    return this.carsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createCar(@Request() req, @Body() body: any) {
    return this.carsService.create(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/my-cars')
  getMyCars(@Request() req) {
    return this.carsService.findBySeller(req.user.userId);
  }
}
