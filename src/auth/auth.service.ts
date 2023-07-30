import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/models/user.model';
import { SignupDto } from './dto/signup.dto';
import { UserHelperService } from 'src/utils/users-helper.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userHelperService: UserHelperService,
  ) {}

  async signup(signupCredentails: SignupDto) {
    const { email, password } = signupCredentails;

    const isExist = await this.userHelperService.findOne({
      email,
    });
    if (isExist) throw new ForbiddenException('User already exist');

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userHelperService.create({
      ...signupCredentails,
      password: hashedPassword,
    });

    return this.jwtResponse(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userHelperService.findOneSelectPassword({ email });
    if (!user) throw new UnauthorizedException();

    const passwordTrue = await bcrypt.compare(password, user.password);
    if (!passwordTrue) throw new UnauthorizedException();

    return this.jwtResponse(user);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async jwtResponse(
    user: UserDocument,
    expiresIn: string | number = '7d',
  ) {
    return {
      access_token: await this.jwtService.signAsync(user.toJSON(), {
        expiresIn,
      }),
    };
  }
}
