import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: any) {
    const existing = await this.userModel.findOne({ email: registerDto.email });
    if (existing) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });
    
    await user.save();
    return this.login(user);
  }

  async login(loginDto: any) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = loginDto.password ? await bcrypt.compare(loginDto.password, user.password) : true;
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints
      }
    };
  }
}
