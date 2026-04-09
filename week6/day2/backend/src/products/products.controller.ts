import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @Post()
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.productsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/toggle-sale')
  async toggleSale(@Param('id') id: string, @Body() body: { discountPercentage: number }) {
    const product = await this.productsService.toggleSale(id, body.discountPercentage);
    if (product.isOnSale) {
      this.notificationsGateway.emitSaleStarted({
        productId: String(product._id),
        message: `🔥 Sale started on ${product.name}! ${body.discountPercentage}% off!`,
      });
    }
    return product;
  }
}
