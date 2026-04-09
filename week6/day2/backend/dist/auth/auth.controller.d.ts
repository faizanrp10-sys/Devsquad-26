import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: Record<string, any>): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: import("../schemas/user.schema").UserRole;
            loyaltyPoints: number;
        };
    }>;
    register(registerDto: Record<string, any>): Promise<{
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
