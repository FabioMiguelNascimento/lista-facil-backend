import { Body, Controller, Post, Res } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly cookiesOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.login(loginDto);

    response.cookie('access_token', access_token, this.cookiesOptions);

    return { message: 'Login realizado com sucesso' };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    const { user, access_token } = await this.authService.register(createUserDto);

    response.cookie('access_token', access_token, this.cookiesOptions);

    return { message: 'Registro realizado com sucesso', user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logout realizado' };
  }
}