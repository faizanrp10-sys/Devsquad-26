import { Model } from 'mongoose';
import { OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
export declare class OrdersService {
    private orderModel;
    private readonly productsService;
    private readonly rawMaterialsService;
    constructor(orderModel: Model<OrderDocument>, productsService: ProductsService, rawMaterialsService: RawMaterialsService);
    create(dto: CreateOrderDto): Promise<OrderDocument>;
    findAll(status?: string): Promise<OrderDocument[]>;
    findById(id: string): Promise<OrderDocument>;
    updateStatus(id: string, status: string): Promise<OrderDocument>;
    getRecentOrders(limit?: number): Promise<OrderDocument[]>;
}
