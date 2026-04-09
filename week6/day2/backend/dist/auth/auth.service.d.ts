import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(registerDto: any): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: import("../schemas/user.schema").UserRole;
            loyaltyPoints: number;
        };
    }>;
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: import("../schemas/user.schema").UserRole;
            loyaltyPoints: number;
        };
    }>;
}
