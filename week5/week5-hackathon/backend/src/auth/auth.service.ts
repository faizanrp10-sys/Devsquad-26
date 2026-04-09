import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailForAuth(email);
    if (!user || !user.password) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }

  async register(data: any) {
    const existing = await this.usersService.findByEmail(data.email);
    if(existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({ ...data, password: hashedPassword });
    return this.login(user);
  }
}
