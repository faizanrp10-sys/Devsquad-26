import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type CarDocument = Car & Document;
export declare class Car {
    make: string;
    model: string;
    year: number;
    price: number;
    auctionEndTime: Date;
    status: string;
    seller: Types.ObjectId | User;
    bodyType: string;
    images: string[];
    description: string;
    winner?: Types.ObjectId | User;
}
export declare const CarSchema: import("mongoose").Schema<Car, import("mongoose").Model<Car, any, any, any, (Document<unknown, any, Car, any, import("mongoose").DefaultSchemaOptions> & Car & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Car, any, import("mongoose").DefaultSchemaOptions> & Car & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Car>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Car, Document<unknown, {}, Car, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    make?: import("mongoose").SchemaDefinitionProperty<string, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    model?: import("mongoose").SchemaDefinitionProperty<string, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    year?: import("mongoose").SchemaDefinitionProperty<number, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    auctionEndTime?: import("mongoose").SchemaDefinitionProperty<Date, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    seller?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bodyType?: import("mongoose").SchemaDefinitionProperty<string, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    winner?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId | undefined, Car, Document<unknown, {}, Car, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Car & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Car>;
