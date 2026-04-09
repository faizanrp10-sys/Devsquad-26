import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string; user: User }> {
    const { username, email, password } = registerDto;

    // Create new user
    const user = await this.usersService.create({
      username,
      email,
      password,
    });

    // Generate JWT token
    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: User }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }
}
