import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserhelperModule } from './utils/users/user-helper.module';
import { TweetsHelperModule } from './utils/tweets/tweets-helper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    TweetsModule,
    AwsModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    UserhelperModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TweetsHelperModule,
  ],
})
export class AppModule {}
