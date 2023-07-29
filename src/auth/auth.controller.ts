import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupCredentails: SignupDto) {
    return this.authService.signup(signupCredentails);
  }

  @Post('login')
  async login(@Body() loginCredentails: LoginDto) {
    return this.authService.login(loginCredentails);
  }
}
