import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Car } from '../../cars/schemas/car.schema';
export type BidDocument = Bid & Document;
export declare class Bid {
    amount: number;
    bidder: Types.ObjectId | User;
    car: Types.ObjectId | Car;
}
export declare const BidSchema: import("mongoose").Schema<Bid, import("mongoose").Model<Bid, any, any, any, (Document<unknown, any, Bid, any, import("mongoose").DefaultSchemaOptions> & Bid & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Bid, any, import("mongoose").DefaultSchemaOptions> & Bid & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Bid>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bid, Document<unknown, {}, Bid, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Bid & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    amount?: import("mongoose").SchemaDefinitionProperty<number, Bid, Document<unknown, {}, Bid, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bid & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bidder?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId, Bid, Document<unknown, {}, Bid, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bid & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    car?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Car, Bid, Document<unknown, {}, Bid, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Bid & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Bid>;
