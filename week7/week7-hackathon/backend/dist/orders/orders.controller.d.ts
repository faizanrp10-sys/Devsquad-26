import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<import("./schemas/order.schema").OrderDocument>;
    findAll(status?: string): Promise<import("./schemas/order.schema").OrderDocument[]>;
    getRecent(limit?: string): Promise<import("./schemas/order.schema").OrderDocument[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").OrderDocument>;
    updateStatus(id: string, status: string): Promise<import("./schemas/order.schema").OrderDocument>;
}
