import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserhelperModule } from 'src/utils/users/user-helper.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserhelperModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
