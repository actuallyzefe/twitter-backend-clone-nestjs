import { Module } from '@nestjs/common';
import { TweetsHelperService } from './tweets-helper.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from 'src/tweets/models/tweets.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
  ],
  providers: [TweetsHelperService],
  exports: [TweetsHelperService],
})
export class TweetsHelperModule {}
