import { ProductsService } from './products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class ProductsController {
    private readonly productsService;
    private readonly notificationsGateway;
    constructor(productsService: ProductsService, notificationsGateway: NotificationsGateway);
    create(createProductDto: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateDto: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleSale(id: string, body: {
        discountPercentage: number;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
