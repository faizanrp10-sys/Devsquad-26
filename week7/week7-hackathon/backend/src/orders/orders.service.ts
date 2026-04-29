import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
    private readonly rawMaterialsService: RawMaterialsService,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderDocument> {
    // 1. Validate stock availability for each item
    for (const item of dto.items) {
      const product = await this.productsService.findById(item.productId);
      if (product.availableQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.productName}". Available: ${product.availableQuantity}, Requested: ${item.quantity}`,
        );
      }
    }

    // 2. Deduct raw materials
    for (const item of dto.items) {
      const product = await this.productsService.findById(item.productId);
      if (product.recipe && product.recipe.length > 0) {
        for (const recipeItem of product.recipe) {
          const deductAmount = recipeItem.quantity * item.quantity;
          await this.rawMaterialsService.deductStock(
            recipeItem.materialId.toString(),
            deductAmount,
          );
        }
      }
    }

    // 3. Calculate totals
    const items = dto.items.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount = dto.discount || 0;
    const total = subtotal - discount;

    // 4. Generate order number
    const orderCount = await this.orderModel.countDocuments().exec();
    const orderNumber = `#${(34562 + orderCount + 1).toString()}`;

    // 5. Create the order
    const order = new this.orderModel({
      orderNumber,
      items,
      subtotal,
      discount,
      total,
      orderType: dto.orderType,
      status: 'Preparing',
      paymentMethod: dto.paymentMethod,
      tableNo: dto.tableNo,
      customerName: dto.customerName,
    });

    return order.save();
  }

  async findAll(status?: string): Promise<OrderDocument[]> {
    const query = status ? { status } : {};
    return this.orderModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async updateStatus(id: string, status: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async getRecentOrders(limit = 10): Promise<OrderDocument[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}
