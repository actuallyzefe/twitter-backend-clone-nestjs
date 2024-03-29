import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TweetsHelperModule } from 'src/utils/tweets/tweets-helper.module';
import { JwtModule } from '@nestjs/jwt';
import { AwsModule } from 'src/aws/aws.module';
import { UserhelperModule } from 'src/utils/users/user-helper.module';

@Module({
  imports: [
    TweetsHelperModule,
    UserhelperModule,
    AwsModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [TweetsService],
  controllers: [TweetsController],
})
export class TweetsModule {}
