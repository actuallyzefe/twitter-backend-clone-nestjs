import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TweetsHelperService } from 'src/utils/tweets/tweets-helper.service';
import { PostTweetDto } from './dto/post-tweet.dto';
import { UserDocument } from 'src/users/models/user.model';
import { AwsService } from 'src/aws/aws.service';
import { UserHelperService } from 'src/utils/users/users-helper.service';

@Injectable()
export class TweetsService {
  constructor(
    private readonly tweetsHelperService: TweetsHelperService,
    private readonly userHelperService: UserHelperService,
    private readonly awsService: AwsService,
  ) {}

  async postTweet(
    currentUser: UserDocument,
    tweetCredentials?: PostTweetDto,
    file?: Express.Multer.File,
  ) {
    const currentUserId = currentUser._id.toString();

    if (!tweetCredentials.tweet && !file) throw new BadRequestException();

    if (file) {
      await this.uploadMedia(file.originalname, file.buffer);
    }

    const tweet = await this.tweetsHelperService.create({
      ...tweetCredentials,
      media: file?.originalname,
      tweetBy: currentUser.id,
    });

    await this.userHelperService.updateOne(currentUserId, {
      $push: { tweets: tweet._id },
    });

    return tweet;
  }

  async likeDislikeTweet(user: UserDocument, id: string) {
    const tweet = await this.tweetsHelperService.findById(id);

    if (!tweet) {
      throw new NotFoundException();
    }

    if (!tweet.likes.includes(user.id)) {
      await this.tweetsHelperService.updateOne(tweet.id, {
        $push: { likes: user._id },
      });

      return { status: 'Success', msg: 'Tweet Liked' };
    }

    await tweet.updateOne({ $pull: { likes: user._id } });

    return { status: 'Success', msg: 'Tweet Disliked' };
  }

  private async uploadMedia(fileName: string, file: Buffer) {
    return this.awsService.upload(fileName, file);
  }

  async deleteTweet() {}
}
