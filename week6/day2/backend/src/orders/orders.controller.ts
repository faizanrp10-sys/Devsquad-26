import { Controller, Get, Post, Body, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Request() req: any, @Body() createOrderDto: any) {
    return this.ordersService.createOrder(req.user.sub, createOrderDto);
  }

  @Get('my-orders')
  getMyOrders(@Request() req: any) {
    return this.ordersService.getUserOrders(req.user.sub);
  }

  @Get()
  getAllOrders() {
    // Admin only - add roles guard in production
    return this.ordersService.getAllOrders();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateOrderStatus(id, body.status);
  }
}
