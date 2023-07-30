import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { askVerifyDto } from './dto/ask-verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupCredentails: SignupDto) {
    return this.authService.signup(signupCredentails);
  }

  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @Post('ask-verify')
  async askCode(@Body() askVerifyDto: askVerifyDto) {
    return this.authService.askVerifyCode(askVerifyDto);
  }

  @Post('login')
  async login(@Body() loginCredentails: LoginDto) {
    return this.authService.login(loginCredentails);
  }
}
