import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserhelperModule } from 'src/utils/users/user-helper.module';
import { MailerModule } from 'src/mail/mailer.module';

@Module({
  imports: [
    UserhelperModule,
    MailerModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
