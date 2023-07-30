import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Tweet, TweetDocument } from 'src/tweets/models/tweets.model';

@Injectable()
export class TweetsHelperService {
  constructor(@InjectModel(Tweet.name) private tweetModel: Model<Tweet>) {}

  async findOne(filter: FilterQuery<Tweet>): Promise<TweetDocument> {
    return this.tweetModel.findOne(filter);
  }

  async findById(id: string): Promise<TweetDocument> {
    return this.tweetModel.findById(id);
  }

  async create(registerDto: Partial<Tweet>): Promise<TweetDocument> {
    return this.tweetModel.create(registerDto);
  }
  async updateOne(
    tweetId: string,
    updateFields: UpdateQuery<Tweet>,
  ): Promise<TweetDocument> {
    return this.tweetModel.findByIdAndUpdate(tweetId, updateFields, {
      new: true,
    });
  }
}
