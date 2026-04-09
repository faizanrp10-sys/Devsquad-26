import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { UserDocument } from '../schemas/user.schema';
import { ProductDocument } from '../schemas/product.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class OrdersService {
    private orderModel;
    private userModel;
    private productModel;
    private notificationsGateway;
    constructor(orderModel: Model<OrderDocument>, userModel: Model<UserDocument>, productModel: Model<ProductDocument>, notificationsGateway: NotificationsGateway);
    createOrder(userId: string, createOrderDto: any): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getUserOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllOrders(): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateOrderStatus(orderId: string, status: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, import("mongoose").DefaultSchemaOptions> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
