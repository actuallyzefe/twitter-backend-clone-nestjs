import { BadRequestException, Injectable } from '@nestjs/common';
import { TweetsHelperService } from 'src/utils/tweets/tweets-helper.service';
import { PostTweetDto } from './dto/post-tweet.dto';
import { UserDocument } from 'src/users/models/user.model';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class TweetsService {
  constructor(
    private readonly tweetsHelperService: TweetsHelperService,
    private readonly awsService: AwsService,
  ) {}

  async postTweet(
    currentUser: UserDocument,
    tweetCredentials?: PostTweetDto,
    file?: Express.Multer.File,
  ) {
    if (!tweetCredentials.tweet && !file) throw new BadRequestException();

    if (file) {
      await this.uploadMedia(file.originalname, file.buffer);
    }

    const tweet = await this.tweetsHelperService.create({
      ...tweetCredentials,
      media: file?.originalname,
      tweetBy: currentUser._id,
    });
    return tweet;
  }

  private async uploadMedia(fileName: string, file: Buffer) {
    return this.awsService.upload(fileName, file);
  }
  async likeDislikeTweet() {}
  async retweet() {}
  async deleteTweet() {}
}
