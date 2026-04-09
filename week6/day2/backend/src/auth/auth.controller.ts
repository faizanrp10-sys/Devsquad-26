import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: Record<string, any>) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: Record<string, any>) {
    return this.authService.register(registerDto);
  }
}
