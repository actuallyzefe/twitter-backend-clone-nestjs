import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/models/user.model';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserHelperService } from 'src/utils/users/users-helper.service';
import { MailerService } from 'src/mail/mailer.service';
import { VerifyDto } from './dto/verify.dto';
import { askVerifyDto } from './dto/ask-verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userHelperService: UserHelperService,
    private readonly mailerService: MailerService,
  ) {}

  async signup(signupCredentails: SignupDto) {
    const { email, password, nickname } = signupCredentails;

    const isExist = await this.userHelperService.findOne({
      email,
    });
    if (isExist) throw new ForbiddenException('User already exist');

    const hashedPassword = await this.hashPassword(password);

    const verifyCode = this.generateVerifyCode();
    const verifyCodeExpiresAt = new Date();
    verifyCodeExpiresAt.setHours(verifyCodeExpiresAt.getHours() + 1);

    const user = await this.userHelperService.create({
      ...signupCredentails,
      password: hashedPassword,
      verifyCode: verifyCode,
      verifyCodeExpiresAt,
      status: false,
    });

    await this.mailerService.sendEmail({
      email,
      nickname,
      context: 'signup',
      verifyCode,
    });

    return this.jwtResponse(user);
  }

  async verify(verifyDto: VerifyDto) {
    const { email, verifyCode } = verifyDto;

    const user = await this.userHelperService.findOne({ email });
    if (!user) throw new NotFoundException();

    if (user.status) throw new BadRequestException('user already verified');

    const now = new Date();
    if (now > user.verifyCodeExpiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    if (verifyCode === user.verifyCode) {
      const updatedUser = await this.userHelperService.updateOne(
        user._id.toString(),
        {
          $set: { status: true },
          $unset: { verifyCode: 1 },
        },
      );

      return this.jwtResponse(updatedUser);
    }

    throw new BadRequestException('verifyCode is wrong');
  }

  async askVerifyCode(askVerifyDto: askVerifyDto) {
    const { email } = askVerifyDto;
    const user = await this.userHelperService.findOne({ email });

    this.generateVerifyCode();
    const verifyCode = this.generateVerifyCode();
    const verifyCodeExpiresAt = new Date();
    verifyCodeExpiresAt.setMinutes(verifyCodeExpiresAt.getMinutes() + 1);

    await this.userHelperService.updateOne(user.id, {
      $set: {
        verifyCode,
        verifyCodeExpiresAt,
      },
    });

    await this.mailerService.sendEmail({
      email,
      nickname: user.nickname,
      context: 'signup',
      verifyCode,
    });

    return { msg: `Code sent to ${email}` };
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

  private generateVerifyCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
