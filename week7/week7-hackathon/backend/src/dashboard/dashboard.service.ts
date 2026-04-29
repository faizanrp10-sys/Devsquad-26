import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly rawMaterialsService: RawMaterialsService,
  ) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total Revenue
    const revenueResult = await this.orderModel.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Total dishes ordered
    const dishesResult = await this.orderModel.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.quantity' } } },
    ]);
    const totalDishesOrdered =
      dishesResult.length > 0 ? dishesResult[0].total : 0;

    // Total unique customers (by customerName or order count)
    const totalOrders = await this.orderModel
      .countDocuments({ status: { $ne: 'Cancelled' } })
      .exec();

    // Most ordered products
    const mostOrdered = await this.orderModel.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalOrdered: { $sum: '$items.quantity' },
          image: { $first: '$items.productImage' },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: '$_id',
          totalOrdered: 1,
          image: 1,
          _id: 0,
        },
      },
    ]);

    // Order type breakdown
    const orderTypeBreakdown = await this.orderModel.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: '$orderType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Recent orders for order report
    const recentOrders = await this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    // Low stock materials
    const lowStockMaterials = await this.rawMaterialsService.getLowStock();

    return {
      totalRevenue,
      totalDishesOrdered,
      totalCustomers: totalOrders,
      mostOrdered,
      orderTypeBreakdown,
      recentOrders,
      lowStockMaterials,
    };
  }
}
