import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class Tweet {
  @Prop({ type: String, required: false })
  tweet: string;

  @Prop({ default: [] })
  likes: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: false, type: String })
  media?: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  tweetBy: mongoose.Schema.Types.ObjectId;
}

export type TweetDocument = HydratedDocument<Tweet>;
export const TweetSchema = SchemaFactory.createForClass(Tweet);
