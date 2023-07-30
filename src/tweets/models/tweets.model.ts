import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Tweet {
  @Prop({ type: String, required: false })
  tweet: string;

  @Prop({ default: [] })
  likes: [];

  @Prop({ required: false, type: String })
  media?: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({
    ref: 'User',
    type: Types.ObjectId,
    required: true,
  })
  tweetBy: Types.ObjectId;
}

export type TweetDocument = HydratedDocument<Tweet>;
export const TweetSchema = SchemaFactory.createForClass(Tweet);

TweetSchema.set('toObject', { virtuals: true });
TweetSchema.set('toJSON', { virtuals: true });
