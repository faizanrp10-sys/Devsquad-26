import { BidsService } from './bids.service';
export declare class BidsController {
    private readonly bidsService;
    constructor(bidsService: BidsService);
    getBidsForCar(carId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/bid.schema").BidDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/bid.schema").Bid & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMyBids(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/bid.schema").BidDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/bid.schema").Bid & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    placeBidREST(req: any, body: any): Promise<{
        bid: Omit<import("mongoose").Document<unknown, {}, import("./schemas/bid.schema").BidDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/bid.schema").Bid & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, never>;
        car: import("../cars/schemas/car.schema").CarDocument;
    }>;
}
