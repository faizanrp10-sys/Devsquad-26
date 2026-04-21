import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { CarsService } from '../cars/cars.service';
export declare class BidsService {
    private bidModel;
    private carsService;
    constructor(bidModel: Model<BidDocument>, carsService: CarsService);
    placeBid(carId: string, userId: string, amount: number): Promise<{
        bid: Omit<import("mongoose").Document<unknown, {}, BidDocument, {}, import("mongoose").DefaultSchemaOptions> & Bid & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, never>;
        car: import("../cars/schemas/car.schema").CarDocument;
    }>;
    getBidsForCar(carId: string): Promise<(import("mongoose").Document<unknown, {}, BidDocument, {}, import("mongoose").DefaultSchemaOptions> & Bid & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getBidsByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, BidDocument, {}, import("mongoose").DefaultSchemaOptions> & Bid & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getCarById(carId: string): Promise<import("../cars/schemas/car.schema").CarDocument>;
    payForCar(carId: string): Promise<import("../cars/schemas/car.schema").CarDocument>;
    updateShippingStatus(carId: string, status: string): Promise<import("../cars/schemas/car.schema").CarDocument>;
}
