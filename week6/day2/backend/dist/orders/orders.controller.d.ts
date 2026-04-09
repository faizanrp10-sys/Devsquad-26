import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: any, createOrderDto: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyOrders(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllOrders(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
