import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        totalRevenue: any;
        totalDishesOrdered: any;
        totalCustomers: number;
        mostOrdered: any[];
        orderTypeBreakdown: any[];
        recentOrders: (import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../orders/schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        lowStockMaterials: import("../raw-materials/schemas/raw-material.schema").RawMaterialDocument[];
    }>;
}
