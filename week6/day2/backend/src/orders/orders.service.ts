import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createOrder(userId: string, createOrderDto: any) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const { items, paymentMethod } = createOrderDto;
    let totalAmount = 0;
    let totalPointsUsed = 0;
    const orderProducts = [];

    for (const item of items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for ${product.name}`);

      const effectivePrice = product.isOnSale ? product.salePrice : product.price;

      if (paymentMethod === 'points' || paymentMethod === 'hybrid') {
        if (product.paymentType === 'money') {
          throw new BadRequestException(`Product ${product.name} cannot be purchased with points`);
        }
        const pointsCost = product.pointsPrice * item.quantity;
        if (user.loyaltyPoints < pointsCost) throw new BadRequestException('Insufficient loyalty points');
        totalPointsUsed += pointsCost;
        user.loyaltyPoints -= pointsCost;
      } else {
        totalAmount += effectivePrice * item.quantity;
      }

      product.stock -= item.quantity;
      await product.save();

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: effectivePrice,
        pointsAtPurchase: product.pointsPrice,
      });
    }

    // Earn loyalty points: 1 point per $10 spent
    const pointsEarned = Math.floor(totalAmount / 10);
    user.loyaltyPoints += pointsEarned;
    await user.save();

    const order = new this.orderModel({
      user: userId,
      products: orderProducts,
      totalAmount,
      paymentMethod,
      pointsEarned,
      pointsUsed: totalPointsUsed,
    });
    await order.save();
    return order;
  }

  async getUserOrders(userId: string) {
    return this.orderModel.find({ user: userId }).populate('products.productId').sort({ createdAt: -1 });
  }

  async getAllOrders() {
    return this.orderModel.find().populate('user', 'name email').populate('products.productId').sort({ createdAt: -1 });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
