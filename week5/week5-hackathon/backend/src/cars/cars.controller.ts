import { Controller, Get, Post, Param, Body, UseGuards, Request, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

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
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  createCar(@Request() req, @Body() body: any, @UploadedFiles() images: any[]) {
    const carData = {
      ...body,
      images: images ? images.map((f: any) => `uploads/${f.filename}`) : [],
    };
    return this.carsService.create(carData, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/my-cars')
  getMyCars(@Request() req) {
    return this.carsService.findBySeller(req.user.userId);
  }
}
