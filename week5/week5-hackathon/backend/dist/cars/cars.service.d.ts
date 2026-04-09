import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
export declare class CarsService {
    private carModel;
    constructor(carModel: Model<CarDocument>);
    create(createData: any, userId: string): Promise<CarDocument>;
    findAll(query: any): Promise<CarDocument[]>;
    findById(id: string): Promise<CarDocument>;
    updatePriceAndWinner(id: string, newPrice: number, winnerId?: string): Promise<(import("mongoose").Document<unknown, {}, CarDocument, {}, import("mongoose").DefaultSchemaOptions> & Car & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateStatus(id: string, status: string): Promise<(import("mongoose").Document<unknown, {}, CarDocument, {}, import("mongoose").DefaultSchemaOptions> & Car & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findBySeller(userId: string): Promise<CarDocument[]>;
}
