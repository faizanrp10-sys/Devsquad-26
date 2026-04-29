import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByGoogleId(googleId: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    createOrUpdate(userData: {
        googleId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        picture?: string;
    }): Promise<UserDocument>;
}
