import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
export declare class DashboardService {
    private orderModel;
    private readonly rawMaterialsService;
    constructor(orderModel: Model<OrderDocument>, rawMaterialsService: RawMaterialsService);
    getStats(): Promise<{
        totalRevenue: any;
        totalDishesOrdered: any;
        totalCustomers: number;
        mostOrdered: any[];
        orderTypeBreakdown: any[];
        recentOrders: (import("mongoose").Document<unknown, {}, OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        lowStockMaterials: import("../raw-materials/schemas/raw-material.schema").RawMaterialDocument[];
    }>;
}
